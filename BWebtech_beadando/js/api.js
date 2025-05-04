const API_ALAP_URL = 'https://iit-playground.arondev.hu/api/'; 
const NEPTUN_KOD = 'GH5OGN'; 

class AutoAPI {
    static async kerelemKeszites(vegpont, beallitasok = {}) { 
        const url = `${API_ALAP_URL}${NEPTUN_KOD}${vegpont}`; 
        
        const kerelemBeallitasok = { 
            ...beallitasok,
            headers: {
                'Accept': 'application/json', 
                ...beallitasok.headers
            }
        };

        try {
            console.log('Kérés küldése a következő címre:', url); 
            console.log('Kérés beállításai:', kerelemBeallitasok); 
            
            const valasz = await fetch(url, kerelemBeallitasok); 
            console.log('Válasz státusza:', valasz.status); 
            
            if (!valasz.ok) { 
                const hibaAdatok = await valasz.json().catch(() => ({})); 
                throw new Error(hibaAdatok.message || 'Ismeretlen hiba történt'); 
            }
            
            const adatok = await valasz.json(); 
            console.log('Fogadott adatok:', adatok); 
            return adatok; 
        } catch (hiba) {
            console.error('Hálózati hiba:', hiba); 
            throw new Error(hiba.message || 'Hálózati hiba történt'); 
        }
    }

    static async osszesAutoLekerdezese() { 
        return this.kerelemKeszites('/car'); 
    }

    static async autoLekerdezeseIdAlapjan(id) { 
        return this.kerelemKeszites(`/car/${id}`); 
    }

    static async autoLetrehozasa(autoAdatok) { 
        return this.kerelemKeszites('/car', { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(autoAdatok) 
        });
    }

    static async autoModositasa(autoAdatok) { 
        return this.kerelemKeszites('/car', { 
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(autoAdatok) 
        });
    }

    static async autoTorlese(id) { 
        return this.kerelemKeszites(`/car/${id}`, { 
            method: 'DELETE'
        });
    }
} 