import { HozzaferesAdat } from './adatok.ts';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';

async function adatLetoltes() {
  try {
    const response = await fetch('https://retoolapi.dev/Giv7of/data');
    if (!response.ok) {
      document.getElementById('errorMessage')!.textContent = 'Hiba a kérés közben!';
      return;
    }

    const adatok = await response.json() as HozzaferesAdat[];
    const adatokElem = document.getElementById('adatok')!;
    adatokElem.innerHTML = '';

    const headerRow = document.createElement('tr');
    const ratingHeader = document.createElement('th');
    ratingHeader.textContent = 'Értékelés';
    const statusHeader = document.createElement('th');
    statusHeader.textContent = 'Státusz';
    const deleteHeader = document.createElement('th');

    headerRow.appendChild(ratingHeader);
    headerRow.appendChild(statusHeader);
    headerRow.appendChild(deleteHeader);
    adatokElem.appendChild(headerRow);

    adatok.forEach(adat => {
      const row = document.createElement('tr');

      const ratingCell = document.createElement('td');
      ratingCell.textContent = `${adat.rating}`;
      row.appendChild(ratingCell);

      const statusCell = document.createElement('td');
      statusCell.textContent = `${adat.status}`;
      row.appendChild(statusCell);

      const deleteCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Törlés';
      deleteButton.className = 'btn btn-danger btn-sm';
      deleteButton.addEventListener('click', async () => {
        await adatTorles(adat.id);
        await adatLetoltes(); 
      });
      deleteCell.appendChild(deleteButton);
      row.appendChild(deleteCell);

      adatokElem.appendChild(row);
    });
  } catch (e: any) {
    document.getElementById('errorMessage')!.textContent =
      'Hiba: ' + e.message;
  }
}

async function adatTorles(id: number) {
  const response = await fetch(`https://retoolapi.dev/Giv7of/data/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    document.getElementById('errorMessage')!.textContent = 'Hiba a törlés során!';
    return;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  adatLetoltes();
  console.log('Lefutott');
});

document.getElementById('ujadat')!.addEventListener('click', async () => {
  const rating = prompt('Kérlek, add meg az értékelést (1-5):');
  const status = prompt('Kérlek, add meg a termék státuszát:');

  if (rating && status) {
    const ujAdat: HozzaferesAdat = {
      id: Date.now(),
      rating: parseInt(rating),
      status: status,
    };

    const response = await fetch('https://retoolapi.dev/Giv7of/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ujAdat),
    });

    if (!response.ok) {
      document.getElementById('errorMessage')!.textContent = 'Hiba az új adat hozzáadása során!';
      return;
    }

    await adatLetoltes();
  } else {
    alert('Kérlek, töltsd ki az összes mezőt!');
  }
});
