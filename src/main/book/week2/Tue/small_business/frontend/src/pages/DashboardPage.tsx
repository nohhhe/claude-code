import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from '@mui/material'
import { TrendingUp, Inventory, People, Assignment } from '@mui/icons-material'
import { useAuthStore } from '../stores/authStore'

export default function DashboardPage() {
  const { user, logout } = useAuthStore()

  const stats = [
    { title: '오늘 매출', value: '₩125,000', icon: TrendingUp, color: '#4caf50' },
    { title: '재고 품목', value: '45개', icon: Inventory, color: '#ff9800' },
    { title: '고객 수', value: '128명', icon: People, color: '#2196f3' },
    { title: '할 일', value: '3개', icon: Assignment, color: '#f44336' },
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          대시보드
        </Typography>
        <Button variant="outlined" onClick={logout}>
          로그아웃
        </Button>
      </Box>
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        안녕하세요, {user?.name}님!
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <stat.icon sx={{ color: stat.color, mr: 1 }} />
                  <Typography variant="h6" component="div">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" color={stat.color}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                최근 매출
              </Typography>
              <Typography variant="body2" color="text.secondary">
                매출 차트가 여기에 표시됩니다.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                최근 활동
              </Typography>
              <Typography variant="body2" color="text.secondary">
                최근 활동 목록이 여기에 표시됩니다.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}