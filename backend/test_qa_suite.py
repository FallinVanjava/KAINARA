"""
KAINARA Automated QA Test Suite
Pengujian komprehensif endpoint FastAPI, logika klasifikasi ML, pembatasan ukuran payload, dan validasi input.
"""

import asyncio
import io
import sys
from pathlib import Path
from PIL import Image
from fastapi import UploadFile

# Setup path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from main import (
    scan_batik,
    scan_skintone,
    scan_feedback,
    get_unlabeled_images,
    process_label,
    LabelRequest,
    CLASS_NAMES,
    SKIN_CLASS_NAMES,
    MAX_UPLOAD_SIZE,
)

def create_dummy_image_bytes(format="JPEG", size=(224, 224), color=(180, 100, 50)):
    buf = io.BytesIO()
    img = Image.new("RGB", size, color=color)
    img.save(buf, format=format)
    buf.seek(0)
    return buf.getvalue()

async def run_async_tests():
    print("=" * 65)
    print("         KAINARA QA AUTOMATED TEST SUITE EXECUTION         ")
    print("=" * 65)
    
    passed = 0
    failed = 0
    total = 0

    def assert_test(name, condition, details=""):
        nonlocal passed, failed, total
        total += 1
        if condition:
            passed += 1
            print(f"  [PASS] {name}")
        else:
            failed += 1
            print(f"  [FAIL] {name} -> {details}")

    # --- TEST SUITE 1: BATIK / TAPIS SCANNER (/v1/scan) ---
    print("\n[TEST SUITE 1] Wastra / Tapis Scanner API (/v1/scan)")

    # TC-01: Valid Image Scan
    img_bytes = create_dummy_image_bytes()
    upload_valid = UploadFile(filename="sample_batik.jpg", file=io.BytesIO(img_bytes), headers={"content-type": "image/jpeg"})
    res = await scan_batik(image=upload_valid)
    
    # Handle response (bisa dict atau JSONResponse)
    if hasattr(res, "status_code"):
        status = res.status_code
        data = res.body.decode() if hasattr(res, "body") else {}
    else:
        status = 200
        data = res

    assert_test("TC-01: Scan with valid image returns success response", status == 200 and data.get("success") is True)
    if status == 200 and data.get("success"):
        res_data = data["data"]
        assert_test("TC-02: Detected motif belongs to CLASS_NAMES", res_data["motif_id"] in CLASS_NAMES)
        assert_test("TC-03: Confidence score is float between 0.0 and 1.0", 0.0 <= res_data["confidence"] <= 1.0)
        assert_test("TC-04: Philosophy text is non-empty string", len(res_data.get("philosophy", "")) > 10)
        assert_test("TC-05: Alternatives list contains secondary predictions", isinstance(res_data.get("alternatives"), list))

    # TC-06: Invalid Content-Type (Text File)
    upload_invalid = UploadFile(filename="test.txt", file=io.BytesIO(b"Hello world"), headers={"content-type": "text/plain"})
    res_inv = await scan_batik(image=upload_invalid)
    assert_test("TC-06: Non-image upload returns HTTP 400 with INVALID_FORMAT", getattr(res_inv, "status_code", None) == 400)

    # TC-07: Payload > 2MB (Boundary Limit Check)
    oversized_bytes = b"X" * (MAX_UPLOAD_SIZE + 1024)
    upload_oversized = UploadFile(filename="huge.jpg", file=io.BytesIO(oversized_bytes), headers={"content-type": "image/jpeg"})
    res_large = await scan_batik(image=upload_oversized)
    assert_test("TC-07: Oversized payload (>2MB) returns HTTP 413 PAYLOAD_TOO_LARGE", getattr(res_large, "status_code", None) == 413)

    # --- TEST SUITE 2: SKIN TONE SCANNER (/v1/skintone) ---
    print("\n[TEST SUITE 2] Skin Tone Analyzer API (/v1/skintone)")

    # TC-08: Valid Skintone Image
    skin_bytes = create_dummy_image_bytes(size=(128, 128), color=(220, 180, 140))
    upload_skin = UploadFile(filename="skin.jpg", file=io.BytesIO(skin_bytes), headers={"content-type": "image/jpeg"})
    res_skin = await scan_skintone(image=upload_skin)
    
    if hasattr(res_skin, "status_code"):
        skin_status = res_skin.status_code
        skin_data = {}
    else:
        skin_status = 200
        skin_data = res_skin

    assert_test("TC-08: Skintone scan returns HTTP 200 with success=True", skin_status == 200 and skin_data.get("success") is True)
    assert_test("TC-09: Tone output is strictly in ['cool', 'neutral', 'warm']", skin_data.get("data", {}).get("tone") in SKIN_CLASS_NAMES)
    assert_test("TC-10: Skintone confidence is between 0.0 and 1.0", 0.0 <= skin_data.get("data", {}).get("confidence", 0) <= 1.0)

    # TC-11: Invalid Skintone content-type
    upload_skin_inv = UploadFile(filename="doc.pdf", file=io.BytesIO(b"%PDF-1.4"), headers={"content-type": "application/pdf"})
    res_skin_inv = await scan_skintone(image=upload_skin_inv)
    assert_test("TC-11: Invalid skintone format returns HTTP 400", getattr(res_skin_inv, "status_code", None) == 400)

    # TC-12: Skintone Oversized Payload
    upload_skin_over = UploadFile(filename="huge_skin.jpg", file=io.BytesIO(oversized_bytes), headers={"content-type": "image/jpeg"})
    res_skin_over = await scan_skintone(image=upload_skin_over)
    assert_test("TC-12: Oversized skintone payload returns HTTP 413", getattr(res_skin_over, "status_code", None) == 413)

    # --- TEST SUITE 3: FEEDBACK LOOP (/v1/scan/feedback) ---
    print("\n[TEST SUITE 3] User Feedback Loop (/v1/scan/feedback)")

    # TC-13: Valid Feedback Submission
    upload_fb = UploadFile(filename="feedback_test.jpg", file=io.BytesIO(img_bytes), headers={"content-type": "image/jpeg"})
    res_fb = await scan_feedback(image=upload_fb, correct_motif_id="tapis_pucuk_rebung")
    assert_test("TC-13: Valid feedback submission returns success message", res_fb.get("success") is True)

    # TC-14: Invalid Motif ID in feedback
    upload_fb_bad = UploadFile(filename="fb.jpg", file=io.BytesIO(img_bytes), headers={"content-type": "image/jpeg"})
    try:
        await scan_feedback(image=upload_fb_bad, correct_motif_id="motif_fiktif_123")
        assert_test("TC-14: Invalid motif_id throws HTTP 400", False, "No exception raised")
    except Exception as e:
        assert_test("TC-14: Invalid motif_id throws HTTP 400 HTTPException", getattr(e, "status_code", 0) == 400)

    # --- TEST SUITE 4: ADMIN LABELER HITL (/v1/admin/*) ---
    print("\n[TEST SUITE 4] Admin Labeler HITL Pipeline")

    # TC-15: Fetch Unlabeled Images
    unlabeled_res = await get_unlabeled_images()
    assert_test("TC-15: GET /v1/admin/unlabeled returns structured response", "success" in unlabeled_res)

    # TC-16: Labeling with invalid motif_id
    try:
        await process_label(LabelRequest(filename="any.jpg", motif_id="invalid_class_xyz"))
        assert_test("TC-16: Process label with invalid motif_id raises HTTP 400", False)
    except Exception as e:
        assert_test("TC-16: Process label with invalid motif_id raises HTTP 400", getattr(e, "status_code", 0) == 400)

    # TC-17: Labeling non-existent file
    try:
        await process_label(LabelRequest(filename="file_definitely_not_exist_9999.jpg", motif_id="tapis_pucuk_rebung"))
        assert_test("TC-17: Labeling non-existent file raises HTTP 404", False)
    except Exception as e:
        assert_test("TC-17: Labeling non-existent file raises HTTP 404", getattr(e, "status_code", 0) == 404)

    print("\n" + "=" * 65)
    print(f"AUTOMATED QA RESULTS: {passed}/{total} Passed, {failed} Failed")
    print("=" * 65)
    
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(run_async_tests())
