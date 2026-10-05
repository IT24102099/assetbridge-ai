import { ServiceProvider, ProviderSearchCriteria, ProviderMatchResult } from './types.js';
import { ProviderAvailability } from '../availability/types.js';

/**
 * Deterministic Matching Engine
 * Decoupled service architecture to allow future AI-assisted matching modules to plug in easily.
 */
export class DeterministicMatchingEngine {
  public static match(
    providers: ServiceProvider[],
    availabilities: ProviderAvailability[],
    criteria: ProviderSearchCriteria
  ): ProviderMatchResult[] {
    const results: ProviderMatchResult[] = [];

    for (const provider of providers) {
      // Skill filter
      if (criteria.skill) {
        const requiredSkill = criteria.skill.toLowerCase();
        const hasSkill = provider.skills.some(
          (s) => s.toLowerCase().includes(requiredSkill) || requiredSkill.includes(s.toLowerCase())
        );
        if (!hasSkill) {
          continue;
        }
      }

      // Location & Distance calculation
      let distance = 15; // default distance in km
      if (criteria.location) {
        const searchLoc = criteria.location.toLowerCase();
        const provLoc = provider.location.toLowerCase();
        if (provLoc.includes(searchLoc) || searchLoc.includes(provLoc)) {
          distance = 5; // close match
        } else if (provider.serviceAreas.some((a) => a.toLowerCase().includes(searchLoc))) {
          distance = 12; // service area match
        } else {
          distance = 35; // farther location
        }

        if (criteria.maxDistance && distance > criteria.maxDistance) {
          continue;
        }
      }

      // Availability check for availableDate
      let availabilityStatus: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' = 'AVAILABLE';
      if (criteria.availableDate) {
        const slotsForDate = availabilities.filter(
          (a) => a.providerId === provider.id && a.date === criteria.availableDate
        );
        if (slotsForDate.length > 0) {
          const hasAvailable = slotsForDate.some((a) => a.status === 'AVAILABLE');
          const hasBusy = slotsForDate.some((a) => a.status === 'BUSY');
          if (hasAvailable) {
            availabilityStatus = 'AVAILABLE';
          } else if (hasBusy) {
            availabilityStatus = 'BUSY';
          } else {
            availabilityStatus = 'UNAVAILABLE';
          }
        } else {
          // No explicit slot created for date: default to AVAILABLE
          availabilityStatus = 'AVAILABLE';
        }
      }

      results.push({
        provider,
        location: provider.location,
        distance,
        rating: provider.rating,
        verificationStatus: provider.verificationStatus,
        jobsCount: provider.jobsCount,
        availability: availabilityStatus,
      });
    }

    // Sort by deterministic quality score: verified first, rating descending, distance ascending
    results.sort((a, b) => {
      if (a.verificationStatus === 'VERIFIED' && b.verificationStatus !== 'VERIFIED') return -1;
      if (a.verificationStatus !== 'VERIFIED' && b.verificationStatus === 'VERIFIED') return 1;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return a.distance - b.distance;
    });

    return results;
  }
}
