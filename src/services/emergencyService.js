const API_BASE = 'http://localhost:5000/api/emergencies';

export async function getEmergencies() {
  const res = await fetch(API_BASE);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Server response:', errorText);
    throw new Error('Failed to fetch emergencies');
  }
  return await res.json();
}

export async function updateEmergency(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Server response:', errorText);
    throw new Error('Failed to update emergency');
  }
  return await res.json();
}

export async function createEmergency(data) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Server response:', errorText);
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.message || 'Failed to create emergency');
    } catch (e) {
      throw new Error(`Server error: ${errorText}`);
    }
  }
  
  return await res.json();
} 