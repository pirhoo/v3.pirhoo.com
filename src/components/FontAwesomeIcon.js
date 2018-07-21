import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Pick icons
import { faKey, faCode, faGraduationCap, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

// And add them to the library
library.add(
  faTwitter,
  faGithub,
  faKey,
  faEnvelope,
  faCode,
  faGraduationCap,
  faTrophy,
);

export default FontAwesomeIcon;
