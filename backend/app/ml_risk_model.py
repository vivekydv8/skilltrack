import numpy as np
from typing import Dict, Any, List

class PureNumpyLogisticRegression:
    """
    Production-grade Logistic Regression classifier implemented in pure NumPy.
    Guarantees 100% mathematical fidelity with zero C-extension DLL / AppControl dependency.
    """
    def __init__(self, learning_rate: float = 0.05, iterations: int = 1000):
        self.lr = learning_rate
        self.iterations = iterations
        self.weights = None
        self.bias = None

    def _sigmoid(self, z):
        return 1.0 / (1.0 + np.exp(-np.clip(z, -25, 25)))

    def fit(self, X: np.ndarray, y: np.ndarray):
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)
        self.bias = 0.0

        for _ in range(self.iterations):
            linear_model = np.dot(X, self.weights) + self.bias
            y_predicted = self._sigmoid(linear_model)

            # Gradient calculation
            dw = (1 / n_samples) * np.dot(X.T, (y_predicted - y))
            db = (1 / n_samples) * np.sum(y_predicted - y)

            self.weights -= self.lr * dw
            self.bias -= self.lr * db

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        linear_model = np.dot(X, self.weights) + self.bias
        prob_1 = self._sigmoid(linear_model)
        return np.column_stack([1.0 - prob_1, prob_1])

class NonPlacementRiskEngine:
    def __init__(self):
        # Initialize and train our Logistic Regression baseline
        # Features: [attendance_pct/100, assessment_score/100, age_norm, is_female, is_sc_st, is_tech]
        self.model = PureNumpyLogisticRegression(learning_rate=0.1, iterations=1200)
        self._train_baseline_model()

    def _train_baseline_model(self):
        # Synthetic baseline training set representing 600 historical skilling trajectories
        np.random.seed(42)
        n = 600
        
        att = np.clip(np.random.normal(0.80, 0.15, n), 0.35, 1.0)
        score = np.clip(np.random.normal(0.72, 0.16, n), 0.30, 0.98)
        age_norm = np.random.uniform(0.0, 1.0, n)
        is_female = np.random.binomial(1, 0.42, n)
        is_sc_st = np.random.binomial(1, 0.35, n)
        is_tech = np.random.binomial(1, 0.60, n)

        X = np.column_stack([att, score, age_norm, is_female, is_sc_st, is_tech])
        
        # Ground truth non-placement probability function
        logits = (
            - 4.2 * att
            - 3.8 * score
            + 0.5 * age_norm
            + 0.2 * is_tech
            + 0.1 * is_sc_st
            + 3.5  # intercept
        )
        probs = 1 / (1 + np.exp(-np.clip(logits, -20, 20)))
        y = (np.random.rand(n) < probs).astype(int)  # 1 = Non-placed (at risk), 0 = Placed
        
        self.model.fit(X, y)

    def evaluate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates non-placement risk score, level, key driving factors,
        and targeted proactive interventions during training.
        """
        attendance = float(data.get("attendance_percentage", 80.0))
        assessment = float(data.get("assessment_score", 70.0))
        age = int(data.get("age", 22))
        gender = str(data.get("gender", "Male")).lower()
        category = str(data.get("category", "General")).upper()
        course_name = str(data.get("course_name", "")).lower()
        district = str(data.get("district", ""))

        # Normalized feature inputs
        att_norm = np.clip(attendance / 100.0, 0.1, 1.0)
        score_norm = np.clip(assessment / 100.0, 0.1, 1.0)
        age_norm = np.clip((age - 18) / 17.0, 0.0, 1.0)
        is_female = 1 if "female" in gender else 0
        is_sc_st = 1 if category in ["SC", "ST", "VJNT"] else 0
        is_tech = 1 if any(t in course_name for t in ["automation", "plc", "battery", "ev", "cloud", "full stack", "technical"]) else 0

        feature_vector = np.array([[att_norm, score_norm, age_norm, is_female, is_sc_st, is_tech]])
        
        # Model predicted probability of non-placement
        prob_risk = float(self.model.predict_proba(feature_vector)[0][1])
        
        # Rule-based adjustments for extreme risk scenarios
        if attendance < 65.0:
            prob_risk = max(prob_risk, 0.72)
        if assessment < 50.0:
            prob_risk = max(prob_risk, 0.78)
        if attendance >= 92.0 and assessment >= 82.0:
            prob_risk = min(prob_risk, 0.15)

        # Risk level determination
        if prob_risk >= 0.65:
            risk_level = "High"
        elif prob_risk >= 0.35:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # Explainable AI factors: identify driving contributors
        risk_factors: List[str] = []
        interventions: List[str] = []

        if attendance < 75.0:
            deficit = round(75.0 - attendance, 1)
            risk_factors.append(f"Attendance Deficit: {attendance}% (Deficit of {deficit}% from mandatory 75% threshold)")
            interventions.append("Trigger automated biometric attendance alert to candidate and local center counsellor")
            interventions.append("Schedule weekend makeup practical lab sessions")

        if assessment < 60.0:
            risk_factors.append(f"Technical Proficiency Lag: Mock assessment score {assessment}/100 is below benchmark")
            interventions.append("Assign peer mentoring support with top-performing candidate in batch")
            interventions.append("Provide targeted module remediation worksheets before final certification")

        if is_tech and assessment < 70.0:
            risk_factors.append(f"Course Rigor Mismatch: High cognitive load technical specialization ({data.get('course_name', 'Tech Course')})")
            interventions.append("Conduct hands-on equipment simulator practice hours")

        if district in ["Gadchiroli", "Nandurbar", "Washim", "Amravati"]:
            risk_factors.append(f"Aspirational District Mobility Constraint: Center located in {district}")
            interventions.append("Verify employer willingness for shared transport / hostel stipend assistance")

        if not risk_factors:
            risk_factors.append("Nominal Risk Profile: Candidate attendance and performance are on track for placement")
            interventions.append("Fast-track candidate for premium employer pre-placement interview rounds")

        return {
            "risk_score": round(prob_risk, 3),
            "risk_level": risk_level,
            "risk_factors": risk_factors,
            "recommended_interventions": interventions
        }

# Global singleton engine
risk_engine = NonPlacementRiskEngine()
