import DashboardLayout from "@/components/layout/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { MOCK_DASHBOARD_STATS } from "@/lib/mock-data";

export default function AnalyticsPage() {
  // Use mock data for beautiful charts since we don't have dedicated analytics endpoint in schema yet
  const data = [
    { name: 'Jan', envoyes: 4000, ouverts: 3800, repondus: 2400 },
    { name: 'Fev', envoyes: 3000, ouverts: 2800, repondus: 1398 },
    { name: 'Mar', envoyes: 2000, ouverts: 1900, repondus: 9800 },
    { name: 'Avr', envoyes: 2780, ouverts: 2608, repondus: 3908 },
    { name: 'Mai', envoyes: 1890, ouverts: 1800, repondus: 4800 },
    { name: 'Jun', envoyes: 2390, ouverts: 2200, repondus: 3800 },
    { name: 'Jul', envoyes: 3490, ouverts: 3300, repondus: 4300 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold">Analytiques Détaillées</h1>
          <p className="text-muted-foreground text-sm mt-1">Analysez les performances de votre canal WhatsApp.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="font-bold mb-6">Performances des Campagnes (6 derniers mois)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="envoyes" name="Envoyés" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.6} />
                  <Bar dataKey="ouverts" name="Ouverts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl">
            <h3 className="font-bold mb-6">Taux de réponse & Engagement</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="repondus" name="Réponses" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
