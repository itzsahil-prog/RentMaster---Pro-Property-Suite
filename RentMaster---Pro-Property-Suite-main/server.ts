
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Analytics Endpoint for Owners
app.get('/api/analytics/:ownerId', async (req, res) => {
  const { ownerId } = req.params;
  
  // In a real app, this would perform complex SQL aggregations
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, price, bookings(id, status)')
    .eq('owner_id', ownerId);

  if (error) return res.status(500).json({ error: error.message });

  // Mocked logic for the example
  const totalRevenue = properties.reduce((acc, p) => acc + (p.price || 0), 0);
  const occupancy = 85; // This would be calculated from real booking data

  res.json({
    revenue: totalRevenue,
    occupancy: occupancy,
    history: [
      { name: 'Jan', revenue: totalRevenue * 0.8 },
      { name: 'Feb', revenue: totalRevenue * 0.9 },
      { name: 'Mar', revenue: totalRevenue }
    ]
  });
});

// Maintenance Issue Reporting
app.post('/api/maintenance', async (req, res) => {
  const { tenantId, propertyId, title, description, priority } = req.body;
  
  const { data, error } = await supabase
    .from('complaints')
    .insert([{ 
      tenant_id: tenantId, 
      property_id: propertyId, 
      title, 
      description, 
      priority,
      status: 'pending' 
    }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Complaint filed successfully', data });
});

app.listen(port, () => {
  console.log(`RentMaster Backend running on port ${port}`);
});
