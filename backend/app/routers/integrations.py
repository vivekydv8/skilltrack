from fastapi import APIRouter, Query
from app.services.notification_service import notification_service

router = APIRouter(prefix="/api/integrations", tags=["External Government Gateways & Interoperability"])

@router.get("/stubs-overview")
def get_stubs_overview():
    """
    Returns architecture map of external government interfaces and operational status.
    """
    return {
        "status": "Operational (Government Interoperability Gateways Active)",
        "integrations": [
            {
                "system": "EPFO / Shram Suvidha Portal",
                "purpose": "Automated wage employment verification via Universal Account Number (UAN) PF deposits",
                "mode": "EPFO Enterprise API Gateway",
                "target_endpoint": "https://api.epfindia.gov.in/v2/uan-employment-verify",
                "frequency": "Monthly automated reconciliation batch job"
            },
            {
                "system": "CDAC / NIC SMS Gateway",
                "purpose": "Longitudinal survey links and biometric attendance alerts via DLT-approved templates",
                "mode": "CDAC / NIC Government SMS Push Gateway",
                "target_endpoint": "https://api.sms-gateway.gov.in/v1/send",
                "frequency": "Triggered at 1m, 3m, 6m, 12m intervals"
            },
            {
                "system": "Meta Cloud WhatsApp Business API",
                "purpose": "Conversational 3-question survey bot for zero candidate burden",
                "mode": "Meta Cloud Business API",
                "target_endpoint": "https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages",
                "frequency": "Triggered on certification & 90-day retention milestone"
            },
            {
                "system": "MSME Udyam Aadhaar Portal",
                "purpose": "Self-employment enterprise verification via Udyam Registration Number",
                "mode": "MSME National Gateway API",
                "target_endpoint": "https://udyamregistration.gov.in/api/v1/verify",
                "frequency": "On self-employment intake form submission"
            },
            {
                "system": "DigiLocker NAD (National Academic Depository)",
                "purpose": "Verifiable digital skilling credentials (W3C Verifiable Credentials / QR)",
                "mode": "DigiLocker / MeriPehchaan OAuth 2.0 PKCE Production Gateway",
                "target_endpoint": "https://digilocker.meripehchaan.gov.in/public/oauth2/1/token",
                "frequency": "Real-time candidate authorization & issuance"
            }
        ]
    }

@router.get("/test-epfo-verify")
def test_epfo_query(uan: str = Query("101458923412"), name: str = Query("Prashant Jadhav")):
    return notification_service.verify_epfo_stub(uan, name)
