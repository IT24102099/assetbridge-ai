import type {
  ServiceProvider,
  AvailabilitySlot,
  ProviderMatchCriteria,
  ProviderMatchResult,
} from '../types'

export function calculateProviderMatch(
  provider: ServiceProvider,
  criteria: ProviderMatchCriteria,
  slots: AvailabilitySlot[]
): ProviderMatchResult {
  const matchReasons: string[] = []
  let score = 0

  // 1. Category Match (30 pts)
  const categoryMatch =
    !criteria.category ||
    criteria.category.toLowerCase() === 'all' ||
    provider.category.toLowerCase() === criteria.category.toLowerCase()

  if (categoryMatch) {
    score += 30
    matchReasons.push(`Category match (${provider.category})`)
  }

  // 2. Region Match (25 pts)
  const regionMatch =
    !criteria.region ||
    criteria.region.toLowerCase() === 'all' ||
    provider.region.toLowerCase() === criteria.region.toLowerCase()

  if (regionMatch) {
    score += 25
    matchReasons.push(`Located in ${provider.region}`)
  }

  // 3. Rating Match (20 pts)
  const minRating = criteria.minRating || 0
  const ratingMatch = provider.rating >= minRating
  if (ratingMatch) {
    score += 20
    matchReasons.push(`High rating (${provider.rating} ★ >= ${minRating} ★ requirement)`)
  } else {
    const partialRating = Math.max(0, (provider.rating / (minRating || 5)) * 15)
    score += partialRating
    matchReasons.push(`Rating ${provider.rating} ★`)
  }

  // 4. Price Match (15 pts)
  const maxPrice = criteria.maxHourlyRate || 9999
  const priceMatch = provider.hourlyRate <= maxPrice
  if (priceMatch) {
    score += 15
    matchReasons.push(`Hourly rate $${provider.hourlyRate}/hr within $${maxPrice}/hr limit`)
  } else {
    const ratio = maxPrice / provider.hourlyRate
    score += Math.max(0, ratio * 10)
    matchReasons.push(`Rate $${provider.hourlyRate}/hr exceeds max budget`)
  }

  // 5. Availability Match (10 pts)
  let availabilityMatch = true
  if (criteria.availabilityDate) {
    const hasSlotOnDate = slots.some(
      (s) =>
        s.providerId === provider.id &&
        s.date === criteria.availabilityDate &&
        s.status === 'available'
    )
    availabilityMatch = hasSlotOnDate
    if (hasSlotOnDate) {
      score += 10
      matchReasons.push(`Has available slot on ${criteria.availabilityDate}`)
    } else {
      matchReasons.push(`No available slot on ${criteria.availabilityDate}`)
    }
  } else {
    // Check if has any available slot
    const hasAnyAvailable = slots.some(
      (s) => s.providerId === provider.id && s.status === 'available'
    )
    if (hasAnyAvailable) {
      score += 10
      matchReasons.push('Has active open slots in calendar')
    }
  }

  // 6. Certification Bonus Check
  if (criteria.requiredCertification) {
    const certMatch = provider.certifications.some((cert) =>
      cert.toLowerCase().includes(criteria.requiredCertification.toLowerCase())
    )
    if (certMatch) {
      score = Math.min(100, score + 5)
      matchReasons.push(`Holds certification: ${criteria.requiredCertification}`)
    }
  }

  const finalScore = Math.min(100, Math.round(score))

  return {
    provider,
    matchScore: finalScore,
    matchReasons,
    categoryMatch,
    regionMatch,
    ratingMatch,
    priceMatch,
    availabilityMatch,
  }
}
