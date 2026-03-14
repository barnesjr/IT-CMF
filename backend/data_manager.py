import json
import os
import shutil
import tempfile
from datetime import datetime
from pathlib import Path

try:
    from .models import (
        AssessmentData, AssessmentItem, CapabilityArea,
        CriticalCapability, MacroCapability, ClientInfo,
        AssessmentMetadata, ScoringConfig,
    )
except ImportError:
    from models import (
        AssessmentData, AssessmentItem, CapabilityArea,
        CriticalCapability, MacroCapability, ClientInfo,
        AssessmentMetadata, ScoringConfig,
    )


class DataManager:
    def __init__(self, base_dir: str, resource_dir: str | None = None):
        self.base_dir = Path(base_dir)
        self.resource_dir = Path(resource_dir) if resource_dir else self.base_dir
        self.data_path = self.base_dir / "data.json"
        self.backup_path = self.base_dir / "data.json.bak"
        self._framework = None

    def load_framework(self) -> dict:
        if self._framework is not None:
            return self._framework

        fw_path = self.resource_dir / "framework" / "assessment-framework.json"
        if not fw_path.exists():
            fw_path = self.base_dir / "framework" / "assessment-framework.json"
        if not fw_path.exists():
            raise FileNotFoundError(f"Framework file not found: {fw_path}")

        with open(fw_path, "r") as f:
            self._framework = json.load(f)
        return self._framework

    def _create_empty_assessment(self) -> AssessmentData:
        fw = self.load_framework()
        macro_caps = []
        for mc in fw.get("macro_capabilities", []):
            ccs = []
            for cc in mc.get("critical_capabilities", []):
                areas = []
                for ca in cc.get("capability_areas", []):
                    items = [
                        AssessmentItem(id=item["id"], text=item["text"])
                        for item in ca.get("items", [])
                    ]
                    areas.append(CapabilityArea(id=ca["id"], name=ca["name"], items=items))
                ccs.append(CriticalCapability(
                    id=cc["id"], name=cc["name"],
                    weight=cc.get("weight", 0.028),
                    capability_areas=areas,
                ))
            macro_caps.append(MacroCapability(
                id=mc["id"], name=mc["name"],
                critical_capabilities=ccs,
            ))

        cc_weights = {}
        for mc in macro_caps:
            for cc in mc.critical_capabilities:
                cc_weights[cc.id] = cc.weight

        return AssessmentData(
            client_info=ClientInfo(),
            assessment_metadata=AssessmentMetadata(
                last_modified=datetime.now().isoformat(),
            ),
            scoring_config=ScoringConfig(
                weighting_model="balanced",
                cc_weights=cc_weights,
            ),
            macro_capabilities=macro_caps,
            target_scores={cc.id: 3.0 for mc in macro_caps for cc in mc.critical_capabilities},
        )

    def load_assessment(self) -> AssessmentData:
        if self.data_path.exists():
            try:
                with open(self.data_path, "r") as f:
                    data = json.load(f)
                return AssessmentData(**data)
            except Exception:
                pass

        if self.backup_path.exists():
            try:
                with open(self.backup_path, "r") as f:
                    data = json.load(f)
                return AssessmentData(**data)
            except Exception:
                pass

        return self._create_empty_assessment()

    def save_assessment(self, data: AssessmentData) -> None:
        data.assessment_metadata.last_modified = datetime.now().isoformat()

        if self.data_path.exists():
            shutil.copy2(self.data_path, self.backup_path)

        fd, tmp_path = tempfile.mkstemp(dir=str(self.base_dir), suffix=".json.tmp")
        try:
            with os.fdopen(fd, "w") as f:
                json.dump(data.model_dump(), f, indent=2, default=str)
            os.replace(tmp_path, str(self.data_path))
        except Exception:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
            raise
