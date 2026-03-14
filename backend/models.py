from pydantic import BaseModel, Field
from typing import Optional


class EvidenceReference(BaseModel):
    document: str = ""
    section: str = ""
    date: str = ""


class AssessmentItem(BaseModel):
    id: str
    text: str
    score: Optional[int] = Field(None, ge=1, le=5)
    na: bool = False
    na_justification: Optional[str] = None
    confidence: Optional[str] = None  # "High" | "Medium" | "Low"
    notes: str = ""
    evidence_references: list[EvidenceReference] = Field(default_factory=list)
    attachments: list[str] = Field(default_factory=list)


class CapabilityArea(BaseModel):
    id: str
    name: str
    items: list[AssessmentItem] = Field(default_factory=list)


class CriticalCapability(BaseModel):
    id: str
    name: str
    weight: float
    capability_areas: list[CapabilityArea] = Field(default_factory=list)


class MacroCapability(BaseModel):
    id: str
    name: str
    critical_capabilities: list[CriticalCapability] = Field(default_factory=list)


class ClientInfo(BaseModel):
    name: str = ""
    industry: str = ""
    assessment_date: str = ""
    assessor: str = ""


class AssessmentMetadata(BaseModel):
    framework_version: str = "1.0"
    tool_version: str = "1.0.0"
    last_modified: str = ""


class ScoringConfig(BaseModel):
    weighting_model: str = "balanced"
    cc_weights: dict[str, float] = Field(default_factory=dict)
    custom_weights: Optional[dict[str, float]] = None


class AssessmentData(BaseModel):
    client_info: ClientInfo = Field(default_factory=ClientInfo)
    assessment_metadata: AssessmentMetadata = Field(default_factory=AssessmentMetadata)
    scoring_config: ScoringConfig = Field(default_factory=ScoringConfig)
    macro_capabilities: list[MacroCapability] = Field(default_factory=list)
    extension_enabled: bool = False
    extension: Optional[dict] = None
    target_scores: dict[str, float] = Field(default_factory=dict)
