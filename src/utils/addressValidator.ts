export interface AddressSuggestion {
  value: string;
  unrestricted_value: string;
  data: {
    city: string;
    street?: string;
    house?: string;
    postal_code?: string;
    geo_lat?: string;
    geo_lon?: string;
  };
}

const DADATA_TOKEN = '7c3e3e3f7c3e3e3f7c3e3e3f7c3e3e3f7c3e3e3f';
const PODOLSK_BOUNDS = {
  from: { lat: 55.3800, lon: 37.4800 },
  to: { lat: 55.4800, lon: 37.6500 }
};

export async function searchAddresses(query: string): Promise<AddressSuggestion[]> {
  if (query.length < 3) return [];

  try {
    const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${DADATA_TOKEN}`,
      },
      body: JSON.stringify({
        query: query,
        count: 5,
        locations: [
          {
            city: 'Подольск',
          }
        ],
        restrict_value: true,
      }),
    });

    if (!response.ok) {
      console.error('DaData API error');
      return [];
    }

    const data = await response.json();
    return data.suggestions || [];
  } catch (error) {
    console.error('Address search error:', error);
    return [];
  }
}

export function validatePodolskAddress(address: AddressSuggestion | null): boolean {
  if (!address) return false;

  const city = address.data.city?.toLowerCase();
  if (!city || !city.includes('подольск')) {
    return false;
  }

  if (address.data.geo_lat && address.data.geo_lon) {
    const lat = parseFloat(address.data.geo_lat);
    const lon = parseFloat(address.data.geo_lon);

    if (
      lat >= PODOLSK_BOUNDS.from.lat &&
      lat <= PODOLSK_BOUNDS.to.lat &&
      lon >= PODOLSK_BOUNDS.from.lon &&
      lon <= PODOLSK_BOUNDS.to.lon
    ) {
      return true;
    }
  }

  return city.includes('подольск');
}

export function formatAddressForDisplay(address: AddressSuggestion): string {
  return address.value;
}

export const mockPodolskAddresses = [
  'г Подольск, ул Революционная',
  'г Подольск, ул Кирова',
  'г Подольск, ул Свердлова',
  'г Подольск, ул Ленина',
  'г Подольск, проспект Ленина',
  'г Подольск, ул Февральская',
  'г Подольск, ул Комсомольская',
  'г Подольск, ул Октябрьская',
  'г Подольск, ул Юбилейная',
  'г Подольск, бульвар 65-летия Победы',
];

export function getMockSuggestions(query: string): Promise<AddressSuggestion[]> {
  const filtered = mockPodolskAddresses
    .filter(addr => addr.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);

  return filtered.map((addr) => ({
    value: addr,
    unrestricted_value: addr,
    data: {
      city: 'Подольск',
      street: addr.split(', ')[1],
      geo_lat: '55.4239',
      geo_lon: '37.5545',
    }
  }));
}
