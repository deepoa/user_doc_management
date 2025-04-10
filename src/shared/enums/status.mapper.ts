import { DocumentStatus } from "./document-status.enum";
import { IngestionStatus } from "./ingestion-status.enum";

export function toIngestionStatus(docStatus: DocumentStatus): IngestionStatus {
    switch(docStatus) {
      case DocumentStatus.UPLOADED: return IngestionStatus.PENDING;
      case DocumentStatus.PROCESSING: return IngestionStatus.PROCESSING;
      case DocumentStatus.COMPLETED: return IngestionStatus.COMPLETED;
      case DocumentStatus.FAILED: return IngestionStatus.FAILED;
      default: return IngestionStatus.PENDING;
    }
  }