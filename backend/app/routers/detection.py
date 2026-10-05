from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Dict, Any, Optional
from ..schemas import DetectionRequest, DetectionResponse, AlertDispatchRequest, AlertDispatchResponse
from ..services.detection_service import DetectionService
from ..services.yolo_detector import get_detector, YOLOGeoMapper
from ..services.alert_service import AlertService

router = APIRouter(prefix="/api/detection", tags=["Satellite Detection"])

@router.post("/analyze-upload")
async def analyze_uploaded_satellite_image(
    file: UploadFile = File(...),
    center_lat: float = Form(28.380),
    center_lon: float = Form(-89.920),
    pixel_res_m: float = Form(10.0),
    confidence_threshold: float = Form(75.0)
):
    """
    Processes a real uploaded satellite image/tile (PNG, JPG, TIFF)
    and extracts dark-spot oil slick boundaries, BAOAC classification, and area.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No image file provided")

    raw_bytes = await file.read()
    try:
        result = DetectionService.process_uploaded_image(
            file_bytes=raw_bytes,
            center_lat=center_lat,
            center_lon=center_lon,
            pixel_res_m=pixel_res_m,
            confidence_threshold=confidence_threshold
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Image processing error: {str(e)}")

@router.post("/process", response_model=DetectionResponse)

def process_satellite_imagery(request: DetectionRequest):
    """
    Triggers AI Vision pipeline on SAR/Optical imagery:
    - Preprocessing & Lee speckle filtering
    - U-Net / SegFormer segmentation
    - Look-alike suppression
    - Physical and geometric characterization
    """
    return DetectionService.process_sar_image(request)

@router.post("/yolo-predict")
def run_yolo_detection(image_filename: str = "sentinel1_sar_crop.tif", conf: float = 0.3) -> Dict[str, Any]:
    """
    Runs YOLOv8 Object Detection on satellite imagery tile.
    Ported from prago-dev/oil-spill-detection.
    """
    detector = get_detector(conf=conf)
    result = detector.predict(image_filename)
    
    # Calculate geographical polygon if detections present
    if result.get("detected") and result.get("detections"):
        bbox = result["detections"][0]["bbox_pixels"]
        geo_poly = YOLOGeoMapper.bbox_to_polygon(
            bbox_pixels=bbox,
            img_origin_lat=28.45,
            img_origin_lon=-90.10
        )
        area_km2 = YOLOGeoMapper.bbox_to_area_km2(bbox)
        result["geo_polygon"] = geo_poly
        result["calculated_area_km2"] = area_km2
        
    return result

@router.post("/dispatch-alert", response_model=AlertDispatchResponse)
def dispatch_coastal_alert(request: AlertDispatchRequest):
    """
    Dispatches automated emergency notification to coastal authorities.
    Ported from prago-dev/oil-spill-detection alert notification system.
    """
    return AlertService.dispatch_oil_spill_alert(
        incident_id=request.incident_id,
        result_label=request.result_label,
        confidence=request.confidence,
        location_name=request.location_name,
        estimated_area_km2=request.estimated_area_km2,
        estimated_barrels=request.estimated_barrels,
        recipient_email=request.recipient_email
    )
