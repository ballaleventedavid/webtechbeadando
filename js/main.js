document.addEventListener('DOMContentLoaded', () => {
    AutoUI.autokBetoltese();

    document.getElementById('list-cars').addEventListener('click', () => AutoUI.autokBetoltese());

    document.getElementById('add-car').addEventListener('click', () => AutoUI.szerkesztesFormMegjelenitese());

    // Modal bezárásakor töröljük a hibaüzeneteket
    document.getElementById('carFormModal').addEventListener('hidden.bs.modal', () => {
        const modalBody = document.querySelector('#carFormModal .modal-body');
        const hibak = modalBody.querySelectorAll('.alert-danger');
        hibak.forEach(hiba => hiba.remove());
    });

    document.getElementById('car-form').addEventListener('submit', async (esemeny) => {
        esemeny.preventDefault();

        const autoId = document.getElementById('car-id').value;
        const autoAdatok = {
            id: autoId,
            brand: document.getElementById('brand').value,
            model: document.getElementById('model').value,
            owner: document.getElementById('owner').value,
            fuelUse: parseFloat(document.getElementById('fuel-use').value),
            dayOfCommission: document.getElementById('day-of-commission').value,
            electric: document.getElementById('electric').checked
        };

        if (!autoAdatok.brand || !autoAdatok.model || !autoAdatok.owner || !autoAdatok.dayOfCommission) {
            AutoUI.hibaMegjelenitese('Minden mezőt ki kell tölteni!', true);
            return;
        }

        if (!autoAdatok.owner.includes(' ')) {
            AutoUI.hibaMegjelenitese('A tulajdonos nevének tartalmaznia kell legalább egy szóközt!', true);
            return;
        }

        if (autoAdatok.electric) {
            autoAdatok.fuelUse = 0;
        } else if (!autoAdatok.fuelUse || autoAdatok.fuelUse <= 0) {
            AutoUI.hibaMegjelenitese('A benzines autó üzemanyag fogyasztásának nagyobbnak kell lennie 0-nál!', true);
            return;
        }

        try {
            if (autoId) {
                await AutoAPI.autoModositasa(autoAdatok);
            } else {
                await AutoAPI.autoLetrehozasa(autoAdatok);
            }

            const modal = bootstrap.Modal.getInstance(document.getElementById('carFormModal'));
            modal.hide();
            await AutoUI.autokBetoltese();
        } catch (hiba) {
            AutoUI.hibaMegjelenitese(hiba.message, true);
        }
    });
}); 