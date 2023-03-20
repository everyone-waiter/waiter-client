import { MenuResponse } from '../../types/menu';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { IMG } from '../../utils/constants';

const setSpicyLevel = (spicy: number) => {
  if (spicy === 0) return null;
  return new Array(spicy)
    .fill(0)
    .map((level, index) => (
      <img key={`spicy${index}`} src={IMG.SPICY} style={{ width: '1.5rem', height: '1.1rem' }} alt={`spicy${level}`} />
    ));
};

const setMenuStatus = (status: string) => {
  if (status === 'NEW' || status === 'BEST') {
    return (
      <img
        key={`status${status}`}
        src={IMG[status]}
        style={{ width: '2rem', height: '1.1rem' }}
        alt={`status${status}`}
      />
    );
  }

  return null;
};

export function ShowMenuList(props: MenuResponse) {
  const { name, description, image, price, spicy, status, notice } = props;
  const spicyLevel = setSpicyLevel(spicy);
  const menuStatus = setMenuStatus(status);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {image ? (
          <CardMedia>
            <img width="100%" height="100%" src={image} alt={name} />
          </CardMedia>
        ) : null}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            <>
              {menuStatus} {name}
              {spicyLevel}
            </>
          </Typography>
          <Typography sx={{ mb: 1, color: 'text.secondary' }}>{description}</Typography>
          {notice !== 'unused' ? <Typography sx={{ mb: 1, color: 'text.secondary' }}>{notice}</Typography> : null}
          <Typography align="right">₩ {price.toLocaleString('ko-KR')}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
