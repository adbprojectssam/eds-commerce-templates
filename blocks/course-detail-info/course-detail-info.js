/*
 * Course Detail Info Block (Education vertical)
 *
 * A content-only overlay authored alongside the shared `product-details` block on a
 * course PDP. It adds the education-specific facts (instructor, cohort dates,
 * prerequisites, format) that a generic Commerce product page doesn't have a slot for.
 * It has no Commerce/GraphQL dependency of its own — it only renders whatever an
 * author puts in the block table, matching the "layer vertical content around the
 * shared drop-in" pattern described in the architecture spec (§5.4).
 *
 * Authoring contract (2-column table, label | value), for example:
 *   Instructor       | Dr. Jane Smith
 *   Cohort Starts     | Oct 6, 2026
 *   Duration          | 6 weeks, 4 hrs/week
 *   Format            | Live online + self-paced
 *   Prerequisites     | None
 */
import { readBlockConfig } from '../../scripts/aem.js';

export default function decorate(block) {
  const config = readBlockConfig(block);

  block.innerHTML = '';

  const heading = document.createElement('h3');
  heading.className = 'course-detail-info-heading';
  heading.textContent = 'Course details';
  block.append(heading);

  const dl = document.createElement('dl');
  dl.className = 'course-detail-info-list';

  Object.entries(config).forEach(([key, value]) => {
    const dt = document.createElement('dt');
    dt.textContent = key.replace(/-/g, ' ');
    const dd = document.createElement('dd');
    dd.textContent = Array.isArray(value) ? value.join(', ') : value;
    dl.append(dt, dd);
  });

  block.append(dl);
}
