import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Logs directory for SMR-MHD Nuclear Telemetry
const DATA_LOGS_DIR = path.join(process.cwd(), 'logs');
const TELEMETRY_LOG_FILE = path.join(DATA_LOGS_DIR, 'mhd_nuclear_telemetry.csv');

if (!fs.existsSync(DATA_LOGS_DIR)) {
  fs.mkdirSync(DATA_LOGS_DIR, { recursive: true });
}

if (!fs.existsSync(TELEMETRY_LOG_FILE)) {
  fs.writeFileSync(
    TELEMETRY_LOG_FILE,
    'TIMESTAMP_EPOCH,FLUID_VELOCITY_MS,INDUCED_VOLTAGE_V,THERMAL_ENERGY_K,GRID_STATUS,POWER_KW\n',
    'utf-8'
  );
}

let SYSTEM_MOCK_TEST_MODE = false;

function recordMhdTelemetryToDisk(vel: number, volt: number, temp: number, status: string, powerKw: number) {
  try {
    const row = `${Date.now() / 1000},${vel.toFixed(2)},${volt.toFixed(2)},${temp.toFixed(2)},${status},${powerKw.toFixed(2)}\n`;
    fs.appendFileSync(TELEMETRY_LOG_FILE, row, 'utf-8');
  } catch (err) {
    console.error('[METRICS FAILURE]: System failed to execute I/O save sequence:', err);
  }
}

// 1. Asynchronous MHD Telemetry Stream
app.get('/api/mhd/telemetry_stream', (_req, res) => {
  const magneticFluxTesla = 4.2;
  const inductionLoopResistanceOhm = 0.5;

  let fluidVelocity: number;
  let coreTemperature: number;
  let gridStatus: string;

  if (SYSTEM_MOCK_TEST_MODE) {
    fluidVelocity = 145.0 + Math.random() * 10.5;
    coreTemperature = 850.0 + (Math.random() - 0.5) * 2.0;
    gridStatus = 'MAX_LOAD_BURST';
  } else {
    fluidVelocity = 85.0 + Math.random() * 13.2;
    coreTemperature = 780.0 + (Math.random() - 0.5) * 24.0;
    gridStatus = 'NOMINAL_EQUILIBRIUM';
  }

  // Programmatic Faraday Generation Induction Math: V = B * (v * 0.05) * 11.5
  const inducedVoltage = magneticFluxTesla * (fluidVelocity * 0.05) * 11.5;

  // Power Calculation: P = V^2 / R (Assumed 0.5 Ohm induction loop internal resistance)
  const generatedPowerKw = (Math.pow(inducedVoltage, 2) / inductionLoopResistanceOhm) / 1000;

  // Check boundary variables to record high-density performance spikes
  if (coreTemperature >= 820.0 || inducedVoltage >= 200.0) {
    recordMhdTelemetryToDisk(fluidVelocity, inducedVoltage, coreTemperature, gridStatus, generatedPowerKw);
  }

  res.json({
    timestamp_epoch: Date.now() / 1000,
    magnetic_flux_field_t: magneticFluxTesla,
    fluid_velocity_ms: parseFloat(fluidVelocity.toFixed(2)),
    induced_voltage_v: parseFloat(inducedVoltage.toFixed(2)),
    core_temperature_k: parseFloat(coreTemperature.toFixed(2)),
    generated_power_kw: parseFloat(generatedPowerKw.toFixed(2)),
    internal_resistance_ohm: inductionLoopResistanceOhm,
    system_state: gridStatus,
    mock_burst_active: SYSTEM_MOCK_TEST_MODE,
  });
});

// 2. Toggle High-Density Mock Mode (850K Burst Test)
app.post('/api/mhd/toggle_force', (_req, res) => {
  SYSTEM_MOCK_TEST_MODE = !SYSTEM_MOCK_TEST_MODE;
  res.json({
    status: 'SUCCESS',
    mock_burst_active: SYSTEM_MOCK_TEST_MODE,
    target_fission_temp_k: SYSTEM_MOCK_TEST_MODE ? 850.0 : 'VARIABLE',
  });
});

// CRC32 calculation helper for in-memory OpenXML Excel packaging
function crc32(buf: Buffer): number {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (-(crc & 1) & 0xedb88320);
    }
  }
  return (~crc) >>> 0;
}

// In-memory zero-dependency ZIP archive builder for standard OpenXML .xlsx files
function buildZipFile(files: { name: string; content: string | Buffer }[]): Buffer {
  const fileRecords: {
    name: string;
    buf: Buffer;
    crc: number;
    offset: number;
  }[] = [];

  const chunks: Buffer[] = [];
  let currentOffset = 0;

  for (const file of files) {
    const buf = Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content, 'utf-8');
    const crc = crc32(buf);
    const nameBuf = Buffer.from(file.name, 'utf-8');

    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0, 6);
    header.writeUInt16LE(0, 8); // STORE method
    header.writeUInt16LE(0, 10);
    header.writeUInt16LE(0, 12);
    header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(buf.length, 18);
    header.writeUInt32LE(buf.length, 22);
    header.writeUInt16LE(nameBuf.length, 26);
    header.writeUInt16LE(0, 28);

    fileRecords.push({
      name: file.name,
      buf,
      crc,
      offset: currentOffset,
    });

    chunks.push(header, nameBuf, buf);
    currentOffset += header.length + nameBuf.length + buf.length;
  }

  const centralDirStart = currentOffset;
  let centralDirSize = 0;

  for (const record of fileRecords) {
    const nameBuf = Buffer.from(record.name, 'utf-8');
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0, 8);
    cd.writeUInt16LE(0, 10);
    cd.writeUInt16LE(0, 12);
    cd.writeUInt16LE(0, 14);
    cd.writeUInt32LE(record.crc, 16);
    cd.writeUInt32LE(record.buf.length, 20);
    cd.writeUInt32LE(record.buf.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(record.offset, 42);

    chunks.push(cd, nameBuf);
    centralDirSize += cd.length + nameBuf.length;
  }

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(fileRecords.length, 8);
  eocd.writeUInt16LE(fileRecords.length, 10);
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirStart, 16);
  eocd.writeUInt16LE(0, 20);

  chunks.push(eocd);
  return Buffer.concat(chunks);
}

const CNC_GCODE_PAYLOAD = `%
( PROGRAM: DETAILED_MANIFOLD_MOCK_ROUTING )
G90 G21 G17 G40 G49 G80 ( Absolute coordinates setup matrix )
G28 G91 Z0.0           ( Retract vertical tool path safely to home index )
M06 T01                ( Call carbide 6mm diameter endmill into spindle )
M03 S5800 M08          ( Spindle ON clockwise at 5800 RPM, activate coolant fluid )
G00 G90 X20.000 Y20.000 Z5.000 ( Traverse tool rapidly to clearing coordinate )
G01 Z-3.500 F750               ( Plunge endmill deep into manifold spacer face )
G01 X185.000 Y20.000 F1150     ( Execute primary linear surface boundary profiling )
G01 X185.000 Y125.000          ( Shift milling path upward along right wall layout )
G02 X165.000 Y145.000 R20.000  ( Interpolated radius profile corner geometry cut )
G01 X45.000 Y145.000           ( Clear machining paths across back system borders )
G00 Z15.000 M09                ( Retract tool spindle line, terminate coolant stream )
M05 M30                        ( Spindle rotation stop, execution loop cycle complete )
%`;

// Download Pre-compiled CNC G-Code
app.get('/download/gcode', (_req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename="production_manifold_toolpath.nc"');
  res.send(CNC_GCODE_PAYLOAD);
});

// Telemetry endpoint alias for automated CI/CD diagnostics
app.get('/api/engine/telemetry', (_req, res) => {
  const v = 90.62 + (Math.random() - 0.5) * 4.0;
  const volt = 4.2 * (v * 0.05) * 11.5;
  const temp = 765.0 + (Math.random() - 0.5) * 16.0;
  res.json({
    timestamp_epoch: Date.now() / 1000,
    core_temperature_k: parseFloat(temp.toFixed(2)),
    fluid_velocity_ms: parseFloat(v.toFixed(2)),
    induced_voltage_v: parseFloat(volt.toFixed(2)),
    manifold_pressure_psi: parseFloat((33.40 + (Math.random() - 0.5) * 1.5).toFixed(2)),
    system_state: temp > 820 ? 'CRITICAL_SURGE' : 'NOMINAL_RUNNING',
  });
});

// Multi-Sheet OpenXML Excel Generation Endpoint
app.get('/api/validation/export_excel', (_req, res) => {
  const telemetryDataset = [
    ['RUN_001', '0.00', '0.00', '0.00', '765.0', 'NOMINAL_START'],
    ['RUN_002', '10.00', '45.30', '109.40', '772.4', 'EQUILIBRIUM_STEADY'],
    ['RUN_003', '20.00', '90.62', '218.45', '780.2', 'NOMINAL_RUNNING'],
    ['RUN_004', '30.00', '94.15', '226.97', '818.5', 'APPROACHING_LIMIT'],
    ['RUN_005', '40.00', '148.60', '358.24', '849.2', 'THERMAL_SURGE'],
    ['RUN_006', '50.00', '151.25', '364.63', '850.0', 'MOCK_TEST_MAX'],
    ['RUN_007', '60.00', '88.40', '213.10', '774.1', 'RECOVERY_RESET'],
  ];

  let sheet1Xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://openxmlformats.org"><sheetData>';
  sheet1Xml += '<row r="1">';
  const headers1 = ['RUN ID', 'TIME DELTA (S)', 'CORE VELOCITY (M/S)', 'INDUCED VOLTAGE (V)', 'THERMAL STATE (K)', 'INTEGRITY CODE'];
  headers1.forEach((h, i) => {
    sheet1Xml += `<c r="${String.fromCharCode(65 + i)}1" t="inlineStr"><is><t>${h}</t></is></c>`;
  });
  sheet1Xml += '</row>';

  telemetryDataset.forEach((dRow, rIdx) => {
    const rowNum = rIdx + 2;
    sheet1Xml += `<row r="${rowNum}">`;
    dRow.forEach((val, cIdx) => {
      const colLetter = String.fromCharCode(65 + cIdx);
      if (cIdx === 0 || cIdx === 5) {
        sheet1Xml += `<c r="${colLetter}${rowNum}" t="inlineStr"><is><t>${val}</t></is></c>`;
      } else {
        sheet1Xml += `<c r="${colLetter}${rowNum}"><v>${val}</v></c>`;
      }
    });
    sheet1Xml += '</row>';
  });
  sheet1Xml += '</sheetData></worksheet>';

  const ipClauses = [
    ['SECTION', 'NON-NEGOTIABLE LEGAL CLAUSE MATRIX TERMS'],
    ['1. Retained Ownership', 'All SMR-MHD code architectures, simulation algorithms, and CAD script files represent pre-existing independent innovations of Amit Nishanka Bhuyan.'],
    ['2. Mandatory Hiring', 'Any executing entity utilizing this layout must offer a permanent position as a Lead Systems Design Architect, AI Researcher, or Advanced Product Coordinator.'],
    ['3. Regional Fallback', 'If visa restrictions apply, an equivalent fully-salaried position must be provided within the Bharat (India) operational division.'],
    ['4. Technology Fees', 'Full access to G-code files is strictly blocked until a lump-sum transfer fee and ongoing royalty structures are executed.'],
  ];

  let sheet2Xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://openxmlformats.org"><sheetData>';
  ipClauses.forEach((dRow, rIdx) => {
    const rowNum = rIdx + 1;
    sheet2Xml += `<row r="${rowNum}">`;
    sheet2Xml += `<c r="A${rowNum}" t="inlineStr"><is><t>${dRow[0]}</t></is></c>`;
    sheet2Xml += `<c r="B${rowNum}" t="inlineStr"><is><t>${dRow[1]}</t></is></c>`;
    sheet2Xml += '</row>';
  });
  sheet2Xml += '</sheetData></worksheet>';

  const contentTypesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://openxmlformats.org"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>';
  const relsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://openxmlformats.org"><Relationship Id="rId1" Type="http://openxmlformats.org" Target="xl/workbook.xml"/></Relationships>';
  const workbookXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://openxmlformats.org" xmlns:r="http://openxmlformats.org"><sheets><sheet name="MHD Validation Logs" sheetId="1" r:id="rId1"/><sheet name="IP Protection Clauses" sheetId="2" r:id="rId2"/></sheets></workbook>';
  const workbookRelsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://openxmlformats.org"><Relationship Id="rId1" Type="http://openxmlformats.org/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://openxmlformats.org/worksheet" Target="worksheets/sheet2.xml"/></Relationships>';

  const zipBuffer = buildZipFile([
    { name: '[Content_Types].xml', content: contentTypesXml },
    { name: '_rels/.rels', content: relsXml },
    { name: 'xl/workbook.xml', content: workbookXml },
    { name: 'xl/_rels/workbook.xml.rels', content: workbookRelsXml },
    { name: 'xl/worksheets/sheet1.xml', content: sheet1Xml },
    { name: 'xl/worksheets/sheet2.xml', content: sheet2Xml },
  ]);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="mhd_hardware_validation_report.xlsx"');
  res.send(zipBuffer);
});

// 3. Export / Read Telemetry Disk Logs
app.get('/api/mhd/logs', (_req, res) => {
  try {
    if (fs.existsSync(TELEMETRY_LOG_FILE)) {
      const content = fs.readFileSync(TELEMETRY_LOG_FILE, 'utf-8');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="mhd_nuclear_telemetry.csv"');
      res.send(content);
    } else {
      res.status(404).send('No telemetry logs generated yet.');
    }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`=========================================================================`);
    console.log(` SMR-MHD NUCLEAR ENERGY TELEMETRY SERVER RUNNING ON PORT ${PORT}`);
    console.log(` Telemetry Stream Endpoint: http://localhost:${PORT}/api/mhd/telemetry_stream`);
    console.log(` Disk Storage File: ${TELEMETRY_LOG_FILE}`);
    console.log(`=========================================================================`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
