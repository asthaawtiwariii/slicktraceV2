from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from ..schemas import AttributionQueryRequest, AttributionResponse
from ..services.attribution_service import AttributionService
from ..services.ais_service import AisService

router = APIRouter(prefix="/api/attribution", tags=["AIS Attribution"])

@router.post("/upload-ais")
async def upload_ais_csv(
    file: Optional[UploadFile] = File(None),
    csv_content: Optional[str] = Form(None)
):
    """
    Ingests real-world or custom AIS CSV records directly into DuckDB.
    Accepts standard Marine Cadastre, Spire, or custom CSV logs.
    """
    content = ""
    if file:
        raw_bytes = await file.read()
        content = raw_bytes.decode("utf-8", errors="ignore")
    elif csv_content:
        content = csv_content
    else:
        raise HTTPException(status_code=400, detail="No CSV file or content provided")

    result = AisService.ingest_custom_ais_csv(content)
    return result

@router.post("/correlate", response_model=AttributionResponse)
def correlate_ais_traffic(request: AttributionQueryRequest):
    """
    Executes spatio-temporal corridor query on DuckDB Marine Cadastre records
    and calculates multi-factor culprit scores for suspect vessels.
    """
    return AttributionService.calculate_attribution(request)

