const subjects = [
  'Quantitative Aptitude',
  'Simplification & Approximation',
  'Number Series',
  'Data Interpretation',
  'Arithmetic & Word Problems',
  'Reasoning Ability',
  'Puzzles & Seating Arrangement',
  'English Language',
  'Reading Comprehension',
  'Vocabulary & Grammar',
  'Banking Awareness',
  'Current Affairs',
  'General Awareness',
  'Computer Awareness',
  'Mock Test Analysis',
  'Revision'
];

const list = document.createElement('datalist');
list.id = 'banking-subjects';
list.innerHTML = subjects.map(subject => `<option value="${subject}"></option>`).join('');
document.body.append(list);

function enhanceTaskInput() {
  const input = document.querySelector('input[placeholder="SQL, Java, DSA…"]');
  if (!input || input.dataset.bankSubjects) return;
  input.dataset.bankSubjects = 'true';
  input.setAttribute('list', 'banking-subjects');
  input.placeholder = 'Choose a subject — Quant, English, Reasoning…';
}

new MutationObserver(enhanceTaskInput).observe(document.body, { childList: true, subtree: true });
enhanceTaskInput();
