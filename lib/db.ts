import Database from 'better-sqlite3';
import path from 'path';
import { randomUUID } from 'node:crypto';

const DB_PATH = path.join(process.cwd(), 'study.db');

// Initialize database
const db = new Database(DB_PATH);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS areas (
    id TEXT PRIMARY KEY,
    subjectId TEXT NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY,
    areaId TEXT NOT NULL,
    name TEXT NOT NULL,
    totalSeconds INTEGER DEFAULT 0,
    completed INTEGER DEFAULT 0,
    FOREIGN KEY (areaId) REFERENCES areas(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    topicId TEXT NOT NULL,
    duration INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    FOREIGN KEY (topicId) REFERENCES topics(id) ON DELETE CASCADE
  );
`);

export default db;

// Helper to seed initial data if empty
export function seedInitialData() {
  const subjectCount = db.prepare('SELECT count(*) as count FROM subjects').get() as { count: number };
  
  if (subjectCount.count === 0) {
    const BIOLOGY_DATA = [
      { category: 'Introdução à Biologia', topics: ['Características gerais dos seres vivos', 'Método científico'] },
      { category: 'Bioquímica', topics: ['Constituintes inorgânicos da célula', 'Glicídios', 'Lipídios', 'Proteínas', 'Enzimas', 'Vitaminas', 'Ácidos nucleicos', 'Código genético', 'Engenharia genética', 'Teste de DNA'] },
      { category: 'Citologia', topics: ['Introdução à citologia', 'Membrana plasmática', 'Citoplasma I', 'Citoplasma II', 'Fermentação', 'Respiração aeróbica', 'Fotossíntese', 'Núcleo', 'Cariótipo', 'Células-tronco', 'Ciclo celular', 'Mitose', 'Meiose'] },
      { category: 'Reprodução Humana', topics: ['Gametogênese', 'Sistemas reprodutores humanos', 'Ciclos ovarianos', 'Fecundação'] },
      { category: 'Embriologia Animal', topics: ['Introdução à embriologia', 'Embriologia do anfioxo', 'Anexos embrionários', 'Embriologia humana'] },
      { category: 'Histologia Animal', topics: ['Tecido epitelial', 'Pele', 'Tecidos conjuntivos', 'Tecido sanguíneo', 'Sistema imune', 'Tecidos cartilaginoso e ósseo', 'Tecido muscular', 'Tecido nervoso'] },
      { category: 'Fisiologia Animal', topics: ['Sistema nervoso', 'Sistema sensorial', 'Sistema endócrino', 'Sistema respiratório', 'Sistema circulatório', 'Sistema digestório', 'Sistema excretório', 'Drogas'] },
      { category: 'Genética', topics: ['Introdução à genética', 'Genealogias e probabilidades', 'Erros inatos e genes letais', 'Polialelismo e sistema ABO', 'Sistema Rh', 'Segunda lei de Mendel', 'Linkage', 'Genética do sexo', 'Pleiotropia, interação gênica e herança quantitativa'] },
      { category: 'Origem da Vida', topics: ['Origem da vida I', 'Origem da vida II'] },
      { category: 'Evolução', topics: ['Conceitos e evidências', 'Teorias evolutivas', 'Fatores evolutivos', 'Genética das populações', 'Especiação', 'Evolução humana'] },
      { category: 'Taxonomia', topics: ['Taxonomia e sistemática', 'Sistemas artificiais e naturais de classificação', 'Cladística e cladogramas', 'Classificação de Lineu em categorias taxonômicas hierarquizadas', 'Classificação atual', 'Regras internacionais de nomenclatura zoológica: sistema binomial', 'Classificação da natureza em reinos', 'Domínio'] },
      { category: 'Microbiologia', topics: ['Introdução à parasitologia', 'Vírus', 'Doenças causadas por ribovírus', 'Doenças causadas por desoxivírus e retrovírus', 'Bactérias', 'Doenças bacterianas', 'Protozoários e doenças protozoóticas', 'Algas', 'Fungos'] },
      { category: 'Botânica', topics: ['Introdução à botânica', 'Briófitas e pteridófitas', 'Gimnospermas e angiospermas', 'Sementes e frutos', 'Germinação e desenvolvimento', 'Histologia vegetal', 'Raiz', 'Caule', 'Folhas', 'Nutrição, absorção e condução vegetal', 'Transpiração e plantas C3, C4 e CAM', 'Movimentos vegetais e fitormônios', 'Floração e fotoperiodismo'] },
      { category: 'Zoologia', topics: ['Introdução à zoologia', 'Filo Porífera', 'Filo Cnidária', 'Filo Platyhelminthes', 'Filo Echinodermata', 'Filo Chordata I', 'Filo Chordata II', 'Filo Chordata III'] },
      { category: 'Ecologia', topics: ['Introdução à ecologia', 'Fluxo de energia', 'Ciclos biogeoquímicos I', 'Ciclos biogeoquímicos II', 'Dinâmica das populações', 'Relações ecológicas', 'Sucessão ecológica', 'Biosfera I', 'Biosfera II', 'Desequilíbrios ecológicos', 'Poluição'] }
    ];

    const COLORS = ['#d68c7a', '#a8b5a2', '#e6d5c3', '#94a3b8', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    const insertSubject = db.prepare('INSERT INTO subjects (id, name, color) VALUES (?, ?, ?)');
    const insertArea = db.prepare('INSERT INTO areas (id, subjectId, name) VALUES (?, ?, ?)');
    const insertTopic = db.prepare('INSERT INTO topics (id, areaId, name, completed) VALUES (?, ?, ?, ?)');

    // Create Biologia as the main subject
    const biologyId = randomUUID();
    insertSubject.run(biologyId, 'Biologia', COLORS[0]);

    BIOLOGY_DATA.forEach((item) => {
      const areaId = randomUUID();
      insertArea.run(areaId, biologyId, item.category);
      
      item.topics.forEach(topicName => {
        const isCompleted = (item.category === 'Introdução à Biologia') || 
                           (item.category === 'Bioquímica' && !['Código genético', 'Engenharia genética', 'Teste de DNA'].includes(topicName));
        
        insertTopic.run(randomUUID(), areaId, topicName, isCompleted ? 1 : 0);
      });
    });
  }
}
