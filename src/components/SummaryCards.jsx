import { Grid, Card, CardContent, Box, Typography, Chip } from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  AttachMoney as RevenueIcon,
  TrendingUp as GrowthIcon,
} from '@mui/icons-material';

const cards = [
  {
    id: 'users',
    label: 'Total Users',
    value: 'totalUsers',
    icon: PeopleIcon,
    color: '#667eea',
    bgColor: 'rgba(102, 126, 234, 0.1)',
    change: '+12%',
  },
  {
    id: 'orders',
    label: 'Total Orders',
    value: 'totalOrders',
    icon: OrdersIcon,
    color: '#48bb78',
    bgColor: 'rgba(72, 187, 120, 0.1)',
    change: '+8%',
  },
  {
    id: 'revenue',
    label: 'Revenue',
    value: 'revenue',
    icon: RevenueIcon,
    color: '#ed8936',
    bgColor: 'rgba(237, 137, 54, 0.1)',
    change: '+23%',
    prefix: '$',
  },
  {
    id: 'growth',
    label: 'Growth Rate',
    value: 'growthRate',
    icon: GrowthIcon,
    color: '#e53e3e',
    bgColor: 'rgba(229, 62, 62, 0.1)',
    change: '+5%',
  },
];

function SummaryCard({ card, stats }) {
  const Icon = card.icon;
  const displayValue = card.prefix 
    ? `${card.prefix}${stats[card.value].toLocaleString()}`
    : stats[card.value];

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card
        sx={{
          height: '100%',
          minHeight: { xs: 140, md: 160 },
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <CardContent sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: { xs: 2.5, md: 3 },
          '&:last-child': { pb: { xs: 2.5, md: 3 } }
        }}>
          {/* Icon and Change Badge Row */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: 2,
          }}>
            <Box
              sx={{
                width: { xs: 52, md: 56 },
                height: { xs: 52, md: 56 },
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: card.bgColor,
                transition: 'all 0.3s ease',
              }}
            >
              <Icon sx={{ fontSize: { xs: 26, md: 28 }, color: card.color }} />
            </Box>
            <Chip
              label={card.change}
              size="small"
              sx={{
                backgroundColor: card.bgColor,
                color: card.color,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 26,
                '& .MuiChip-label': {
                  px: 1.5,
                },
              }}
            />
          </Box>

          {/* Value and Label */}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.75rem', md: '2rem' },
                lineHeight: 1.2,
                mb: 0.5,
                color: 'text.primary',
              }}
            >
              {displayValue}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                fontSize: { xs: '0.875rem', md: '0.9375rem' },
              }}
            >
              {card.label}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default function SummaryCards({ stats }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <SummaryCard key={card.id} card={card} stats={stats} />
        ))}
      </Grid>
    </Box>
  );
}
