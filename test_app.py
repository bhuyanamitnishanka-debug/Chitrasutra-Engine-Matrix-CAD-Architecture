import pytest
import io
import zipfile
import xml.etree.ElementTree as ET
from app import app

@pytest.fixture
def test_client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_telemetry_endpoint(test_client):
    """
    Verifies that the /api/engine/telemetry endpoint responds with clean JSON
    containing valid core temperature and velocity metrics.
    """
    response = test_client.get('/api/engine/telemetry')
    assert response.status_code == 200
    data = response.get_json()
    assert 'core_temperature_k' in data
    assert 'fluid_velocity_ms' in data

def test_gcode_download_endpoint(test_client):
    """
    Verifies that the /download/gcode endpoint streams the pre-compiled
    G-Code toolpath payload.
    """
    response = test_client.get('/download/gcode')
    assert response.status_code == 200
    text = response.data.decode('utf-8')
    assert "G90 G21" in text
    assert "M30" in text

def test_excel_export_multi_sheet_integrity(test_client):
    """
    Rigorously tests the OpenXML binary payload to ensure sheet structure
    and non-negotiable IP clauses are present upon file extraction.
    """
    # 1. Execute live network fetch trigger on Excel endpoint
    response = test_client.get('/api/validation/export_excel')
    assert response.status_code == 200
    assert response.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    # 2. Extract byte arrays straight into a virtual Zip Archive tracker
    zip_bytes = io.BytesIO(response.data)
    with zipfile.ZipFile(zip_bytes, 'r') as archive:
        file_list = archive.namelist()
        
        # Verify OpenXML structural mapping layers are present
        assert "xl/workbook.xml" in file_list
        assert "xl/worksheets/sheet1.xml" in file_list
        assert "xl/worksheets/sheet2.xml" in file_list

        # 3. VERIFY SHEET 2: LEGAL PROTECTION CLAUSE CONTENT INTEGRITY
        sheet2_content = archive.read("xl/worksheets/sheet2.xml").decode('utf-8')
        
        # Audit legal parameter keywords inside the compiled XML layer string
        assert "Non-Negotiable Legal Clause Matrix Terms" in sheet2_content
        assert "Retained Ownership" in sheet2_content
        assert "Mandatory Hiring" in sheet2_content
        assert "Bharat (India)" in sheet2_content
        assert "Royalty" in sheet2_content or "Lump-sum" in sheet2_content

        print("[TEST METRICS SUCCESS]: Excel architecture, multi-sheet mappings, and legal safety clauses verified.")
