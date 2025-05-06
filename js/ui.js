class AutoUI {
    static betoltesMegjelenitese() {
        const autoLista = document.getElementById('car-list');
        autoLista.innerHTML = `
            <div class="col-12 text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Betöltés...</span>
                </div>
            </div>
        `;
    }

    static hibaMegjelenitese(uzenet, modal = false) {
        if (modal) {
            const modalBody = document.querySelector('#carFormModal .modal-body');
            const hibaUzenet = document.createElement('div');
            hibaUzenet.className = 'alert alert-danger mt-3';
            hibaUzenet.role = 'alert';
            hibaUzenet.textContent = uzenet;
            
            // Először töröljük a korábbi hibaüzeneteket
            const regiHibak = modalBody.querySelectorAll('.alert-danger');
            regiHibak.forEach(hiba => hiba.remove());
            
            // Hozzáadjuk az új hibaüzenetet
            modalBody.appendChild(hibaUzenet);
        } else {
            const autoLista = document.getElementById('car-list');
            autoLista.innerHTML = `
                <div class="col-md-4 col-sm-6 mb-4">
                    <div class="card car-card h-100">
                        <div class="card-body">
                            <div class="alert alert-danger" role="alert">
                                ${uzenet}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    static autoListaMegjelenitese(autok) {
        const autoLista = document.getElementById('car-list');
        autoLista.innerHTML = '';

        if (autok.length === 0) {
            autoLista.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info" role="alert">
                        Nincsenek autók a rendszerben.
                    </div>
                </div>
            `;
            return;
        }

        autok.forEach(auto => {
            const autoKartya = document.createElement('div');
            autoKartya.className = 'col-md-4 col-sm-6 mb-4';
            autoKartya.innerHTML = `
                <div class="card car-card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${auto.brand} ${auto.model}</h5>
                        <p class="card-text">
                            <strong>Tulajdonos:</strong> ${auto.owner}<br>
                            <strong>Üzemanyag fogyasztás:</strong> ${auto.fuelUse} l/100km<br>
                            <strong>Gyártás dátuma:</strong> ${auto.dayOfCommission}<br>
                            <strong>Típus:</strong> ${auto.electric ? 'Elektromos' : 'Benzines'}
                        </p>
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-primary reszletek-gomb" data-id="${auto.id}">Részletek</button>
                            <button class="btn btn-warning szerkesztes-gomb" data-id="${auto.id}">Szerkesztés</button>
                            <button class="btn btn-danger torles-gomb" data-id="${auto.id}">Törlés</button>
                        </div>
                    </div>
                </div>
            `;
            autoLista.appendChild(autoKartya);
        });

        document.querySelectorAll('.reszletek-gomb').forEach(gomb => {
            gomb.addEventListener('click', () => this.autoReszletekMegjelenitese(gomb.dataset.id));
        });

        document.querySelectorAll('.szerkesztes-gomb').forEach(gomb => {
            gomb.addEventListener('click', () => this.szerkesztesFormMegjelenitese(gomb.dataset.id));
        });

        document.querySelectorAll('.torles-gomb').forEach(gomb => {
            gomb.addEventListener('click', () => this.autoTorlese(gomb.dataset.id));
        });
    }

    static async autoReszletekMegjelenitese(id) {
        try {
            const auto = await AutoAPI.autoLekerdezeseIdAlapjan(id);
            const autoReszletek = document.getElementById('car-details');
            autoReszletek.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${auto.brand} ${auto.model}</h5>
                        <p class="card-text">
                            <strong>Tulajdonos:</strong> ${auto.owner}<br>
                            <strong>Üzemanyag fogyasztás:</strong> ${auto.fuelUse} l/100km<br>
                            <strong>Gyártás dátuma:</strong> ${auto.dayOfCommission}<br>
                            <strong>Típus:</strong> ${auto.electric ? 'Elektromos' : 'Benzines'}
                        </p>
                    </div>
                </div>
            `;
            const modal = new bootstrap.Modal(document.getElementById('carDetailsModal'));
            modal.show();
        } catch (hiba) {
            this.hibaMegjelenitese(hiba.message);
        }
    }

    static async szerkesztesFormMegjelenitese(id = null) {
        const form = document.getElementById('car-form');
        const autoIdInput = document.getElementById('car-id');
        const modal = new bootstrap.Modal(document.getElementById('carFormModal'));

        if (id) {
            try {
                const auto = await AutoAPI.autoLekerdezeseIdAlapjan(id);
                autoIdInput.value = auto.id;
                document.getElementById('brand').value = auto.brand;
                document.getElementById('model').value = auto.model;
                document.getElementById('owner').value = auto.owner;
                document.getElementById('fuel-use').value = auto.fuelUse;
                document.getElementById('day-of-commission').value = auto.dayOfCommission;
                document.getElementById('electric').checked = auto.electric;
            } catch (hiba) {
                this.hibaMegjelenitese(hiba.message, true);
                return;
            }
        } else {
            form.reset();
            autoIdInput.value = '';
        }

        modal.show();
    }

    static async autoTorlese(id) {
        if (confirm('Biztosan törölni szeretné ezt az autót?')) {
            try {
                await AutoAPI.autoTorlese(id);
                await this.autokBetoltese();
            } catch (hiba) {
                this.hibaMegjelenitese(hiba.message);
            }
        }
    }

    static async autokBetoltese() {
        this.betoltesMegjelenitese();
        try {
            const autok = await AutoAPI.osszesAutoLekerdezese();
            this.autoListaMegjelenitese(autok);
        } catch (hiba) {
            this.hibaMegjelenitese(hiba.message);
        }
    }
} 