import uuid
from datetime import datetime
from typing import Dict, Any
from app.config import settings

class NotificationService:
    @staticmethod
    def send_survey_notification(
        trainee_name: str,
        phone: str,
        checkpoint: str,
        survey_token: str,
        channel: str = "SMS"
    ) -> Dict[str, Any]:
        """
        Sends an ACTUAL SMS via Twilio if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are provided.
        Falls back to a verifiable simulated SID if trial keys are not yet configured in .env.
        """
        survey_link = f"{settings.FRONTEND_URL}/survey/{survey_token}"
        
        message_body = (
            f"Namaskar {trainee_name}! Dept of Skills, Govt of Maharashtra: "
            f"Please update your career progression for the {checkpoint} milestone: "
            f"{survey_link} - Your response helps measure scheme impact."
        )

        # Check if real Twilio credentials are provided
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN and settings.TWILIO_PHONE_NUMBER:
            try:
                from twilio.rest import Client
                client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
                
                # Format phone number for international E.164 if needed
                formatted_phone = phone.strip().replace(" ", "").replace("-", "")
                if not formatted_phone.startswith("+"):
                    if len(formatted_phone) == 10:
                        formatted_phone = f"+91{formatted_phone}"
                    else:
                        formatted_phone = f"+{formatted_phone}"

                twilio_message = client.messages.create(
                    body=message_body,
                    from_=settings.TWILIO_PHONE_NUMBER,
                    to=formatted_phone
                )

                print(f"[TWILIO_SMS_SUCCESS] Live SMS sent! SID={twilio_message.sid}, Status={twilio_message.status}, To={formatted_phone}")

                return {
                    "success": True,
                    "is_real_twilio": True,
                    "sid": twilio_message.sid,
                    "status": twilio_message.status,
                    "recipient_phone": formatted_phone,
                    "channel": "Twilio_SMS",
                    "checkpoint": checkpoint,
                    "survey_link": survey_link,
                    "timestamp": datetime.utcnow().isoformat(),
                    "message_body": message_body
                }

            except Exception as e:
                print(f"[TWILIO_SMS_ERROR] Failed sending live Twilio SMS: {e}")
                # Fallback to simulated delivery with error note
                sim_sid = f"SM_FAILOVER_{uuid.uuid4().hex[:16]}"
                return {
                    "success": False,
                    "is_real_twilio": True,
                    "sid": sim_sid,
                    "status": f"failed: {str(e)}",
                    "recipient_phone": phone,
                    "channel": "Twilio_SMS_Failover",
                    "checkpoint": checkpoint,
                    "survey_link": survey_link,
                    "timestamp": datetime.utcnow().isoformat(),
                    "message_body": message_body,
                    "error": str(e)
                }
        else:
            # Simulated trial delivery
            sim_sid = f"SM_SIMULATED_{uuid.uuid4().hex[:16]}"
            print(f"[TWILIO_SMS_MOCK] TWILIO keys not configured in .env. Simulated SMS generated: SID={sim_sid}")
            print(f"[TWILIO_SMS_MOCK] To send real SMS to {phone}, add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in backend/.env")
            
            return {
                "success": True,
                "is_real_twilio": False,
                "sid": sim_sid,
                "status": "simulated_queued (paste Twilio keys in backend/.env for live cellular dispatch)",
                "recipient_phone": phone,
                "channel": channel,
                "checkpoint": checkpoint,
                "survey_link": survey_link,
                "timestamp": datetime.utcnow().isoformat(),
                "message_body": message_body,
                "instructions": "To receive live cellular SMS: Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in backend/.env"
            }

notification_service = NotificationService()
