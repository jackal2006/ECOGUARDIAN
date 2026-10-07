export type WasteClassificationCategory =
  | 'Plastic'
  | 'Paper'
  | 'Glass'
  | 'Metal'
  | 'Organic'
  | 'E-Waste'
  | 'Hazardous Waste'
  | 'Other';

export interface WasteIdentificationResult {
  isWaste: boolean;
  unclearImage?: boolean;
  detectedItem: string;
  category: WasteClassificationCategory;
  confidence: 'High' | 'Medium' | 'Low';
  estimatedConfidenceScore: number; // e.g. 94
  reason: string;
  disposalMethod: string;
  environmentalImpact: string;
  ecoAlternative: string;
  multipleObjectsDetected?: boolean;
  multipleObjectsNote?: string;
  isHazardous?: boolean;
  safetyWarning?: string;
  keyAdvice?: string[];
  message?: string;
  isAIAssisted: boolean;
}

export class WasteIdentificationError extends Error {
  code: 'INVALID_IMAGE' | 'IMAGE_TOO_LARGE' | 'API_FAILURE' | 'NETWORK_FAILURE' | 'NO_WASTE' | 'UNCLEAR_IMAGE';

  constructor(
    message: string,
    code: 'INVALID_IMAGE' | 'IMAGE_TOO_LARGE' | 'API_FAILURE' | 'NETWORK_FAILURE' | 'NO_WASTE' | 'UNCLEAR_IMAGE'
  ) {
    super(message);
    this.name = 'WasteIdentificationError';
    this.code = code;
  }
}

/**
 * Validates the uploaded file before processing
 */
export function validateWasteImageFile(file: File): void {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    throw new WasteIdentificationError(
      'Invalid file format. Please upload a JPG, JPEG, PNG, or WEBP image.',
      'INVALID_IMAGE'
    );
  }

  // Maximum size 10MB
  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new WasteIdentificationError(
      'The selected image exceeds the 10MB maximum file size limit. Please choose a smaller photo.',
      'IMAGE_TOO_LARGE'
    );
  }
}

/**
 * Main modular function to analyze waste images via server-side Gemini Vision API
 */
export async function identifyWasteImage(
  imageDataUrl: string,
  fileName?: string
): Promise<WasteIdentificationResult> {
  if (!imageDataUrl || !imageDataUrl.startsWith('data:image')) {
    throw new WasteIdentificationError('Invalid image data. Please provide a valid photo.', 'INVALID_IMAGE');
  }

  const mimeMatch = imageDataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

  try {
    const response = await fetch('/api/identify-waste', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageDataUrl,
        mimeType,
        filename: fileName,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Server returned ${response.status}`);
    }

    const data = await response.json();

    // Check specific conditions per user requirements
    if (data.isWaste === false) {
      return {
        isWaste: false,
        detectedItem: data.detectedItem || 'Non-waste object',
        category: 'Other',
        confidence: data.confidence || 'Medium',
        estimatedConfidenceScore: data.estimatedConfidenceScore || 80,
        reason: data.reason || 'No recognizable discarded material, packaging, or litter was detected.',
        disposalMethod: 'N/A',
        environmentalImpact: 'N/A',
        ecoAlternative: 'N/A',
        message: data.message || 'We could not identify any waste item in this photo. Please ensure the waste item is centered and in clear view.',
        isAIAssisted: true,
        keyAdvice: data.keyAdvice || ['Upload a photo showing discarded items, containers, or litter.'],
      };
    }

    if (data.unclearImage) {
      return {
        isWaste: true,
        unclearImage: true,
        detectedItem: data.detectedItem || 'Ambiguous Discarded Item',
        category: (data.category as WasteClassificationCategory) || 'Other',
        confidence: 'Low',
        estimatedConfidenceScore: data.estimatedConfidenceScore || 52,
        reason: data.reason || 'The visual features are ambiguous or obscured. Cannot determine exact polymer or composition with high confidence.',
        disposalMethod: data.disposalMethod || 'Please inspect physical item for SPI resin marks or recycling symbols before binning.',
        environmentalImpact: data.environmentalImpact || 'Uncertain due to ambiguous material characteristics.',
        ecoAlternative: data.ecoAlternative || 'Consider re-taking a clearer picture with better lighting.',
        message: 'The photo is too blurry or unclear to classify with high confidence. Please provide a clearer, well-lit image.',
        isAIAssisted: true,
        keyAdvice: ['Ensure good ambient lighting', 'Focus camera directly on the object', 'Avoid extreme angles or heavy shadows'],
      };
    }

    return {
      isWaste: true,
      detectedItem: data.detectedItem || 'Classified Discarded Item',
      category: (data.category as WasteClassificationCategory) || 'Plastic',
      confidence: data.confidence || 'High',
      estimatedConfidenceScore: data.estimatedConfidenceScore || 94,
      reason: data.reason || 'Identified based on visual surface reflectance, structural geometry, and material attributes.',
      disposalMethod: data.disposalMethod || 'Check local municipal curbside stream guidelines for this material category.',
      environmentalImpact: data.environmentalImpact || 'Improper disposal contributes to persistent environmental contamination.',
      ecoAlternative: data.ecoAlternative || 'Select reusable or zero-waste alternatives whenever possible.',
      multipleObjectsDetected: Boolean(data.multipleObjectsDetected),
      multipleObjectsNote: data.multipleObjectsNote,
      isHazardous: Boolean(data.isHazardous),
      safetyWarning: data.safetyWarning,
      keyAdvice: data.keyAdvice || ['Rinse if food residue is present', 'Check for local recycling labels'],
      isAIAssisted: true,
    };
  } catch (err: any) {
    console.error('Error during waste identification:', err);

    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new WasteIdentificationError(
        'Network failure. Could not connect to the environmental vision service. Please check your internet connection and try again.',
        'NETWORK_FAILURE'
      );
    }

    throw new WasteIdentificationError(
      err?.message || 'The AI service encountered an error while analyzing the image. Please try again.',
      'API_FAILURE'
    );
  }
}
