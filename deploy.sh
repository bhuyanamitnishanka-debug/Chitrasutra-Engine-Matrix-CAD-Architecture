#!/bin/bash
# ==============================================================================
# SCRIPT: deploy.sh
# DESCRIPTION: Unified one-click multi-cloud deployment orchestrator for
#              the containerized SMR-MHD interactive simulation engine.
# ==============================================================================

set -e # Terminate script immediately if any individual deployment stage fails

echo "========================================================================="
echo "        SMR-MHD PROPULSION SIMULATION INTERFACE CLOUD ORCHESTRATOR        "
echo "========================================================================="
echo "Select target enterprise infrastructure deployment route:"
echo "1) Deploy to Google Cloud Platform (GCP Cloud Run)"
echo "2) Deploy to Amazon Web Services (AWS App Runner)"
echo "-------------------------------------------------------------------------"
read -p "Enter selection choice (1 or 2): " DEPLOY_CHOICE

# Prompt for account identification metrics dynamically to ensure security
read -p "Enter your Cloud Project ID or AWS Account Number: " CLOUD_ACCOUNT_ID
read -p "Enter target region (Default: asia-south1 / asia-south-1): " REGION
REGION=${REGION:-"asia-south1"}

if [ "$DEPLOY_CHOICE" == "1" ]; then
    echo "Initializing deployment sequence to Google Cloud Platform (GCP)..."
    
    # 1. Configuration checks
    gcloud config set project "$CLOUD_ACCOUNT_ID"
    gcloud services enable artifactregistry.googleapis.com run.googleapis.com
    
    # 2. Build secure container registry architecture
    if ! gcloud artifacts repositories describe smr-mhd-registry --location="$REGION" &>/dev/null; then
        gcloud artifacts repositories create smr-mhd-registry \
            --repository-format=docker \
            --location="$REGION" \
            --description="Secure repository for SMR-MHD engine container images"
    fi
    
    # 3. Build and deploy container runtime matrix
    IMAGE_TAG="$REGION-docker.pkg.dev/$CLOUD_ACCOUNT_ID/smr-mhd-registry/simulation-app:v1"
    gcloud builds submit --tag "$IMAGE_TAG"
    
    gcloud run deploy smr-mhd-simulation \
        --image "$IMAGE_TAG" \
        --region="$REGION" \
        --platform=managed \
        --allow-unauthenticated \
        --port=5000 \
        --memory=512Mi \
        --cpu=1
        
    echo "[DEPLOY SUCCESS]: Interactive panel successfully live on GCP Cloud Run."

elif [ "$DEPLOY_CHOICE" == "2" ]; then
    AWS_REGION="${REGION/south1/south-1}" # Normalize GCP zone mappings to AWS standards
    echo "Initializing deployment sequence to Amazon Web Services (AWS)..."
    
    # 1. Docker authentication via remote AWS ECR layer
    aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$CLOUD_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
    
    # 2. Establish Elastic Container Repository parameters
    if ! aws ecr describe-repositories --repository-names smr-mhd-core --region "$AWS_REGION" &>/dev/null; then
        aws ecr create-repository --repository-name smr-mhd-core --region "$AWS_REGION"
    fi
    
    # 3. Build, tag, and push container models to remote AWS ECR stack
    AWS_IMAGE_URI="$CLOUD_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/smr-mhd-core:latest"
    docker build -t smr-mhd-core .
    docker tag smr-mhd-core:latest "$AWS_IMAGE_URI"
    docker push "$AWS_IMAGE_URI"
    
    # 4. Trigger deployment runtime on AWS App Runner
    aws apprunner create-service \
        --service-name smr-mhd-runner-service \
        --source-configuration "{
            \"ImageRepository\": {
                \"ImageIdentifier\": \"$AWS_IMAGE_URI\",
                \"ImageConfiguration\": { \"Port\": \"5000\" },
                \"ImageRepositoryType\": \"ECR\"
            },
            \"AutoDeploymentsEnabled\": false
        }" \
        --region "$AWS_REGION"
        
    echo "[DEPLOY SUCCESS]: Interactive framework successfully live on AWS App Runner."

else
    echo "Invalid input parameters. Exiting configuration matrix."
    exit 1
fi
