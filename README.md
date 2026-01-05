# Memória Pública - Drag & Drop Learning Tool

## JSON Data Structure Documentation

### Overview
The learning tool uses JSON files to define drag-and-drop exercises where users match subtopics to their corresponding main topics. Each JSON file represents a subject with multiple topics and their characteristics.

### File Structure

```json
{
  "subject": "Subject Title",
  "subtopicsLabel": "Label for subtopics",
  "topics": {
    "name": "Main Category Name",
    "values": [
      {
        "name": "Topic Name",
        "comment": "Brief description",
        "image": "path/to/image.png",
        "source": "https://source-url.com",
        "subtopics": [
          {
            "name": "Subtopic description",
            "comment": "Category/type",
            "image": "path/to/subtopic-image.png"
          }
        ]
      }
    ]
  }
}
```

### Field Specifications

#### Root Level (Mandatory)
- **`subject`** (string): Main subject title displayed at the top
- **`subtopicsLabel`** (string): Label for the subtopics panel (e.g., "Características", "Definições")
- **`topics`** (object): Container for all topics

#### Topics Object (Mandatory)
- **`name`** (string): Category name for the topics
- **`values`** (array): Array of topic objects

#### Topic Object
- **`name`** (string, mandatory): Topic name displayed in drop zones
- **`comment`** (string, optional): Brief description shown in tooltips
- **`image`** (string, optional): Path to topic image (local or URL)
- **`source`** (string, optional): Source URL displayed in modal
- **`subtopics`** (array, mandatory): Array of subtopic objects

#### Subtopic Object
- **`name`** (string, mandatory): Subtopic text for drag-and-drop
- **`comment`** (string, optional): Category/classification for organization
- **`image`** (string, optional): Path to subtopic image (local or URL)

### Best Practices

#### Subtopic Design
1. **Uniqueness**: Each subtopic should be uniquely identifiable to only one topic
2. **Completeness**: Subtopics should be complete, standalone sentences
3. **Specificity**: Avoid ambiguous terms that could apply to multiple topics
4. **Technical Accuracy**: Include specific technical details (ports, protocols, standards)

#### Examples of Good Subtopics
```json
{
  "name": "Protocolo da camada de transporte que oferece confiabilidade com multi-streaming e multi-homing",
  "comment": "Características únicas"
}
```

#### Examples of Poor Subtopics (Ambiguous)
```json
{
  "name": "Opera na camada de transporte",
  "comment": "Muito genérico - TCP, UDP, SCTP todos operam nesta camada"
}
```

### Image Support
- **Local images**: `"./subjects/category/topic/image.png"`
- **External URLs**: `"https://example.com/image.png"`
- **Display**: Images show with 🖼️ icon and modal on click

### Example Prompts for New Subjects

#### Computer Networks
```
Create a JSON for "Modelos de Referência OSI vs TCP/IP" with:
- Topics: OSI (7 layers), TCP/IP (4 layers)
- Subtopics: Layer characteristics, protocols, functions
- Focus on unique identifiers for each layer
```

#### Database Systems
```
Create a JSON for "Tipos de Bancos de Dados" with:
- Topics: Relacional, NoSQL Document, NoSQL Key-Value, NoSQL Graph, NoSQL Column-Family
- Subtopics: Characteristics, use cases, examples, ACID properties
- Ensure each subtopic uniquely identifies one database type
```

#### Software Engineering
```
Create a JSON for "Metodologias Ágeis" with:
- Topics: Scrum, Kanban, XP, Lean
- Subtopics: Ceremonies, roles, artifacts, principles
- Make subtopics specific to avoid confusion between methodologies
```

#### Information Security
```
Create a JSON for "Tipos de Ataques Cibernéticos" with:
- Topics: Phishing, DDoS, SQL Injection, XSS, MITM
- Subtopics: Attack vectors, prevention methods, characteristics
- Focus on unique attack signatures and prevention techniques
```

#### Constitutional Law
```
Create a JSON for "Competências Constitucionais" with:
- Topics: União, Estados, Municípios, Distrito Federal
- Subtopics: Exclusive competencies, concurrent competencies, examples
- Ensure legal accuracy and unique jurisdictional aspects
```

### File Organization
```
subjects/
├── redes/
│   ├── protocolos.json
│   └── protocolos/
│       ├── tcp-header.png
│       └── udp-header.png
├── direito/
│   ├── competencias.json
│   └── competencias/
├── ti/
│   ├── cobit.json
│   └── itil.json
└── outros/
    └── preposicoes.json
```

### Validation Checklist
- [ ] All mandatory fields present
- [ ] Subtopics are unique and unambiguous
- [ ] Technical details are accurate
- [ ] Images paths are correct (if used)
- [ ] JSON syntax is valid
- [ ] Each subtopic clearly belongs to only one topic
- [ ] Comments help organize subtopics by category

### Common Pitfalls
1. **Ambiguous subtopics** that could match multiple topics
2. **Generic descriptions** without specific technical details
3. **Missing protocol numbers, ports, or standards** for technical subjects
4. **Incomplete sentences** that lack context
5. **Overlapping characteristics** between different topics