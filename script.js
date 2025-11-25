// Estado del árbol genealógico - SOLO HASTA ABUELOS
let familyTree = {
    "yo": { name: "Tú", nationalities: [] },
    "padre": { name: "Padre", nationalities: [] },
    "madre": { name: "Madre", nationalities: [] },
    "abuelo-paterno": { name: "Abuelo paterno", nationalities: [] },
    "abuela-paterna": { name: "Abuela paterna", nationalities: [] },
    "abuelo-materno": { name: "Abuelo materno", nationalities: [] },
    "abuela-materna": { name: "Abuela materna", nationalities: [] }
};

let currentEditingPerson = null;

const countryFlags = {
    "cuba": "🇨🇺", "estados-unidos": "🇺🇸", "españa": "🇪🇸", "italia": "🇮🇹", 
    "portugal": "🇵🇹", "alemania": "🇩🇪", "francia": "🇫🇷", "irlanda": "🇮🇪",
    "polonia": "🇵🇱", "hungria": "🇭🇺", "grecia": "🇬🇷", "mexico": "🇲🇽",
    "canada": "🇨🇦", "argentina": "🇦🇷", "chile": "🇨🇱"
};

const nationalityRules = {
    "estados-unidos": {
        name: "Estados Unidos",
        requirements: [
            { description: "Nacido en Estados Unidos", check: (t) => t.yo.nationalities.includes("estados-unidos") },
            { description: "Padre o madre estadounidense", check: (t) => t.padre.nationalities.includes("estados-unidos") || t.madre.nationalities.includes("estados-unidos") }
        ],
        check: (t) => ({ available: (t.yo.nationalities.includes("estados-unidos") || t.padre.nationalities.includes("estados-unidos") || t.madre.nationalities.includes("estados-unidos")) && !t.yo.nationalities.includes("estados-unidos"), fulfilledRequirements: nationalityRules["estados-unidos"].requirements.filter(req => req.check(t)) })
    },
    "españa": {
        name: "España",
        requirements: [
            { description: "Padre o madre español", check: (t) => t.padre.nationalities.includes("españa") || t.madre.nationalities.includes("españa") },
            { description: "Abuelo español", check: (t) => t["abuelo-paterno"].nationalities.includes("españa") || t["abuela-paterna"].nationalities.includes("españa") || t["abuelo-materno"].nationalities.includes("españa") || t["abuela-materna"].nationalities.includes("españa") }
        ],
        check: (t) => ({ available: (t.padre.nationalities.includes("españa") || t.madre.nationalities.includes("españa") || t["abuelo-paterno"].nationalities.includes("españa") || t["abuela-paterna"].nationalities.includes("españa") || t["abuelo-materno"].nationalities.includes("españa") || t["abuela-materna"].nationalities.includes("españa")) && !t.yo.nationalities.includes("españa"), fulfilledRequirements: nationalityRules["españa"].requirements.filter(req => req.check(t)) })
    },
    "italia": {
        name: "Italia", 
        requirements: [
            { description: "Ascendente italiano", check: (t) => Object.values(t).some(r => r.nationalities.includes("italia")) }
        ],
        check: (t) => ({ available: Object.values(t).some(r => r.nationalities.includes("italia")) && !t.yo.nationalities.includes("italia"), fulfilledRequirements: nationalityRules["italia"].requirements.filter(req => req.check(t)) })
    },
    "portugal": {
        name: "Portugal",
        requirements: [
            { description: "Padre o madre portugués", check: (t) => t.padre.nationalities.includes("portugal") || t.madre.nationalities.includes("portugal") },
            { description: "Abuelo portugués", check: (t) => t["abuelo-paterno"].nationalities.includes("portugal") || t["abuela-paterna"].nationalities.includes("portugal") || t["abuelo-materno"].nationalities.includes("portugal") || t["abuela-materna"].nationalities.includes("portugal") }
        ],
        check: (t) => ({ available: (t.padre.nationalities.includes("portugal") || t.madre.nationalities.includes("portugal") || t["abuelo-paterno"].nationalities.includes("portugal") || t["abuela-paterna"].nationalities.includes("portugal") || t["abuelo-materno"].nationalities.includes("portugal") || t["abuela-materna"].nationalities.includes("portugal")) && !t.yo.nationalities.includes("portugal"), fulfilledRequirements: nationalityRules["portugal"].requirements.filter(req => req.check(t)) })
    },
    "alemania": {
        name: "Alemania",
        requirements: [
            { description: "Padre alemán", check: (t) => t.padre.nationalities.includes("alemania") },
            { description: "Madre alemana", check: (t) => t.madre.nationalities.includes("alemania") }
        ],
        check: (t) => ({ available: (t.padre.nationalities.includes("alemania") || t.madre.nationalities.includes("alemania")) && !t.yo.nationalities.includes("alemania"), fulfilledRequirements: nationalityRules["alemania"].requirements.filter(req => req.check(t)) })
    },
    "francia": {
        name: "Francia",
        requirements: [
            { description: "Padre francés", check: (t) => t.padre.nationalities.includes("francia") },
            { description: "Madre francesa", check: (t) => t.madre.nationalities.includes("francia") }
        ],
        check: (t) => ({ available: (t.padre.nationalities.includes("francia") || t.madre.nationalities.includes("francia")) && !t.yo.nationalities.includes("francia"), fulfilledRequirements: nationalityRules["francia"].requirements.filter(req => req.check(t)) })
    },
    "irlanda": {
        name: "Irlanda",
        requirements: [
            { description: "Padre o madre irlandés", check: (t) => t.padre.nationalities.includes("irlanda") || t.madre.nationalities.includes("irlanda") },
            { description: "Abuelo irlandés", check: (t) => t["abuelo-paterno"].nationalities.includes("irlanda") || t["abuela-paterna"].nationalities.includes("irlanda") || t["abuelo-materno"].nationalities.includes("irlanda") || t["abuela-materna"].nationalities.includes("irlanda") }
        ],
        check: (t) => ({ available: (t.padre.nationalities.includes("irlanda") || t.madre.nationalities.includes("irlanda") || t["abuelo-paterno"].nationalities.includes("irlanda") || t["abuela-paterna"].nationalities.includes("irlanda") || t["abuelo-materno"].nationalities.includes("irlanda") || t["abuela-materna"].nationalities.includes("irlanda")) && !t.yo.nationalities.includes("irlanda"), fulfilledRequirements: nationalityRules["irlanda"].requirements.filter(req => req.check(t)) })
    },
    "polonia": {
        name: "Polonia",
        requirements: [
            { description: "Ascendente polaco", check: (t) => Object.values(t).some(r => r.nationalities.includes("polonia")) }
        ],
        check: (t) => ({ available: Object.values(t).some(r => r.nationalities.includes("polonia")) && !t.yo.nationalities.includes("polonia"), fulfilledRequirements: nationalityRules["polonia"].requirements.filter(req => req.check(t)) })
    },
    "hungria": {
        name: "Hungría",
        requirements: [
            { description: "Ascendente húngaro", check: (t) => Object.values(t).some(r => r.nationalities.includes("hungria")) }
        ],
        check: (t) => ({ available: Object.values(t).some(r => r.nationalities.includes("hungria")) && !t.yo.nationalities.includes("hungria"), fulfilledRequirements: nationalityRules["hungria"].requirements.filter(req => req.check(t)) })
    },
    "grecia": {
        name: "Grecia",
        requirements: [
            { description: "Padre o madre griego", check: (t) => t.padre.nationalities.includes("grecia") || t.madre.nationalities.includes("grecia") },
            { description: "Abuelo griego", check: (t) => t["abuelo-paterno"].nationalities.includes("grecia") || t["abuela-paterna"].nationalities.includes("grecia") || t["abuelo-materno"].nationalities.includes("grecia") || t["abuela-materna"].nationalities.includes("grecia") }
        ],
        check: (t) => ({ available: (t.padre.nationalities.includes("grecia") || t.madre.nationalities.includes("grecia") || t["abuelo-paterno"].nationalities.includes("grecia") || t["abuela-paterna"].nationalities.includes("grecia") || t["abuelo-materno"].nationalities.includes("grecia") || t["abuela-materna"].nationalities.includes("grecia")) && !t.yo.nationalities.includes("grecia"), fulfilledRequirements: nationalityRules["grecia"].requirements.filter(req => req.check(t)) })
    },
    "mexico": {
        name: "México",
        requirements: [
            { description: "Nacido en México", check: (t) => t.yo.nationalities.includes("mexico") },
            { description: "Padre o madre mexicano", check: (t) => t.padre.nationalities.includes("mexico") || t.madre.nationalities.includes("mexico") }
        ],
        check: (t) => ({ available: (t.yo.nationalities.includes("mexico") || t.padre.nationalities.includes("mexico") || t.madre.nationalities.includes("mexico")) && !t.yo.nationalities.includes("mexico"), fulfilledRequirements: nationalityRules["mexico"].requirements.filter(req => req.check(t)) })
    },
    "canada": {
        name: "Canadá",
        requirements: [
            { description: "Nacido en Canadá", check: (t) => t.yo.nationalities.includes("canada") },
            { description: "Padre o madre canadiense", check: (t) => t.padre.nationalities.includes("canada") || t.madre.nationalities.includes("canada") }
        ],
        check: (t) => ({ available: (t.yo.nationalities.includes("canada") || t.padre.nationalities.includes("canada") || t.madre.nationalities.includes("canada")) && !t.yo.nationalities.includes("canada"), fulfilledRequirements: nationalityRules["canada"].requirements.filter(req => req.check(t)) })
    },
    "argentina": {
        name: "Argentina",
        requirements: [
            { description: "Nacido en Argentina", check: (t) => t.yo.nationalities.includes("argentina") },
            { description: "Padre o madre argentino", check: (t) => t.padre.nationalities.includes("argentina") || t.madre.nationalities.includes("argentina") }
        ],
        check: (t) => ({ available: (t.yo.nationalities.includes("argentina") || t.padre.nationalities.includes("argentina") || t.madre.nationalities.includes("argentina")) && !t.yo.nationalities.includes("argentina"), fulfilledRequirements: nationalityRules["argentina"].requirements.filter(req => req.check(t)) })
    },
    "chile": {
        name: "Chile",
        requirements: [
            { description: "Nacido en Chile", check: (t) => t.yo.nationalities.includes("chile") },
            { description: "Padre o madre chileno", check: (t) => t.padre.nationalities.includes("chile") || t.madre.nationalities.includes("chile") }
        ],
        check: (t) => ({ available: (t.yo.nationalities.includes("chile") || t.padre.nationalities.includes("chile") || t.madre.nationalities.includes("chile")) && !t.yo.nationalities.includes("chile"), fulfilledRequirements: nationalityRules["chile"].requirements.filter(req => req.check(t)) })
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadTreeFromStorage();
    updateTreeDisplay();
});

// Funciones principales
function editPerson(element) {
    currentEditingPerson = element.getAttribute('data-id');
    const person = familyTree[currentEditingPerson];
    document.getElementById('person-name').value = person.name;
    updateSelectedNationalities();
    document.getElementById('modal-title').textContent = `Editar ${person.name}`;
    document.getElementById('person-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('person-modal').style.display = 'none';
    currentEditingPerson = null;
}

function addNationality() {
    const select = document.getElementById('nationality-select');
    const nationality = select.value;
    if (!nationality) return;
    if (!familyTree[currentEditingPerson].nationalities.includes(nationality)) {
        familyTree[currentEditingPerson].nationalities.push(nationality);
        updateSelectedNationalities();
    }
    select.value = '';
}

function removeNationality(nationality) {
    if (!currentEditingPerson) return;
    familyTree[currentEditingPerson].nationalities = familyTree[currentEditingPerson].nationalities.filter(n => n !== nationality);
    updateSelectedNationalities();
}

function updateSelectedNationalities() {
    const container = document.getElementById('selected-nationalities');
    container.innerHTML = '';
    if (!currentEditingPerson) return;
    familyTree[currentEditingPerson].nationalities.forEach(nationality => {
        const tag = document.createElement('div');
        tag.className = 'nationality-tag';
        tag.innerHTML = `${countryFlags[nationality] || '🌍'} ${getCountryDisplayName(nationality)}<i class="fas fa-times" onclick="removeNationality('${nationality}')"></i>`;
        container.appendChild(tag);
    });
}

function getCountryDisplayName(code) {
    const names = {
        "cuba": "Cuba", "estados-unidos": "Estados Unidos", "españa": "España", "italia": "Italia",
        "portugal": "Portugal", "alemania": "Alemania", "francia": "Francia", "irlanda": "Irlanda",
        "polonia": "Polonia", "hungria": "Hungría", "grecia": "Grecia", "mexico": "México",
        "canada": "Canadá", "argentina": "Argentina", "chile": "Chile"
    };
    return names[code] || code;
}

function savePerson() {
    if (!currentEditingPerson) return;
    const name = document.getElementById('person-name').value;
    if (name) familyTree[currentEditingPerson].name = name;
    updateTreeDisplay();
    saveTreeToStorage();
    closeModal();
    showNotification('Cambios guardados correctamente', 'success');
}

function updateTreeDisplay() {
    Object.keys(familyTree).forEach(personId => {
        const element = document.querySelector(`[data-id="${personId}"]`);
        if (element) {
            const person = familyTree[personId];
            element.querySelector('span').textContent = person.name;
            const badgesContainer = element.querySelector('.nationality-badges');
            badgesContainer.innerHTML = '';
            person.nationalities.forEach(nationality => {
                const badge = document.createElement('div');
                badge.className = 'nationality-badge';
                badge.innerHTML = `<span>${countryFlags[nationality] || '🌍'}</span>`;
                badge.title = getCountryDisplayName(nationality);
                badgesContainer.appendChild(badge);
            });
            if (person.nationalities.length > 0) {
                element.style.borderColor = '#4a7c59';
                element.style.background = '#f0f7f0';
            } else {
                element.style.borderColor = '#8fbc8f';
                element.style.background = '#ffffff';
            }
        }
    });
}

function analyzeNationalities() {
    const resultsContainer = document.getElementById('nationality-results');
    resultsContainer.innerHTML = '';
    
    const hasAnyData = Object.values(familyTree).some(person => person.nationalities.length > 0);
    if (!hasAnyData) {
        resultsContainer.innerHTML = '<div class="placeholder"><p>No hay nacionalidades asignadas. Haz clic en cualquier familiar para agregar sus nacionalidades.</p></div>';
        return;
    }
    
    const yourNationalities = familyTree.yo.nationalities;
    const availableCountries = [];
    
    Object.keys(nationalityRules).forEach(countryCode => {
        const analysis = nationalityRules[countryCode].check(familyTree);
        if (analysis.available) {
            availableCountries.push({ code: countryCode, rule: nationalityRules[countryCode], analysis: analysis });
        }
    });
    
    if (availableCountries.length === 0) {
        let message = 'No se encontraron nacionalidades disponibles.';
        if (yourNationalities.length > 0) {
            message += ` Ya tienes: ${yourNationalities.map(n => getCountryDisplayName(n)).join(', ')}.`;
        }
        resultsContainer.innerHTML = `<div class="placeholder"><p>${message}</p><p>Agrega más nacionalidades a tus familiares.</p></div>`;
        return;
    }
    
    availableCountries.forEach(({ code, rule, analysis }) => {
        const card = document.createElement('div');
        card.className = 'nationality-card available';
        card.innerHTML = `
            <h4>${countryFlags[code]} ${rule.name}<span class="availability-status available">Disponible</span></h4>
            <p><strong>Requisitos cumplidos:</strong></p>
            <div class="requirements-list">
                ${analysis.fulfilledRequirements.map(req => `<div class="requirement-status fulfilled"><i class="fas fa-check-circle"></i><span>${req.description}</span></div>`).join('')}
            </div>
            <div class="next-steps"><p><strong>Próximos pasos:</strong> Consulta con el consulado correspondiente.</p></div>
        `;
        resultsContainer.appendChild(card);
    });
    
    showNotification(`Se encontraron ${availableCountries.length} nacionalidad(es) disponible(s)`, 'success');
}

function clearTree() {
    if (!confirm('¿Estás seguro de que quieres limpiar todo el árbol?')) return;
    Object.keys(familyTree).forEach(personId => {
        familyTree[personId].nationalities = [];
        const defaultNames = {
            'yo': 'Tú', 'padre': 'Padre', 'madre': 'Madre', 'abuelo-paterno': 'Abuelo paterno',
            'abuela-paterna': 'Abuela paterna', 'abuelo-materno': 'Abuelo materno', 'abuela-materna': 'Abuela materna'
        };
        familyTree[personId].name = defaultNames[personId];
    });
    updateTreeDisplay();
    saveTreeToStorage();
    showNotification('Árbol limpiado correctamente', 'success');
}

function exportTree() {
    document.getElementById('export-data').value = JSON.stringify(familyTree, null, 2);
    showNotification('Código del árbol generado', 'success');
}

function copyToClipboard() {
    const exportData = document.getElementById('export-data');
    exportData.select();
    document.execCommand('copy');
    showNotification('Código copiado al portapapeles', 'success');
}

function importTree() {
    const importData = document.getElementById('import-data').value;
    if (!importData) {
        showNotification('Por favor, pega el código del árbol', 'error');
        return;
    }
    try {
        const parsedTree = JSON.parse(importData);
        if (typeof parsedTree === 'object' && parsedTree.yo) {
            familyTree = parsedTree;
            updateTreeDisplay();
            saveTreeToStorage();
            document.getElementById('import-data').value = '';
            showNotification('Árbol cargado correctamente', 'success');
        } else {
            showNotification('El código no tiene el formato correcto', 'error');
        }
    } catch (error) {
        showNotification('Error al leer el código. Verifica el formato.', 'error');
    }
}

function saveTreeToStorage() {
    localStorage.setItem('familyTree', JSON.stringify(familyTree));
}

function loadTreeFromStorage() {
    const savedTree = localStorage.getItem('familyTree');
    if (savedTree) {
        try {
            familyTree = JSON.parse(savedTree);
        } catch (error) {
            console.error('Error loading tree from storage:', error);
        }
    }
}

function showNotification(message, type) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : 'info'}"></i>${message}`;
    container.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}

window.onclick = function(event) {
    if (event.target === document.getElementById('person-modal')) {
        closeModal();
    }
};