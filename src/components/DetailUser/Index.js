import { Box, Stack, Typography, styled, Select, MenuItem, Grid, TableContainer, Table, TableHead, TableRow, TableCell, Checkbox } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import Card from '../Card/Index';
import { datasCard } from '../../datas/datasCard';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig';
import { datasDetailHead } from '../../datas/datasDetailHead';
import TableEmployment from '../TableEmployment/Index';



const DetailUser = () => {
  const [load, setLoad] = useState(false);
  const [reload, setReload] = useState(false);
  const [datasDetailUser, setDatasDetailUser] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const StyledSelect = styled(Select)(({ theme }) => ({
    backgroundColor: 'white',
    width: 158,
    height: 44,
    padding: '10px 18px',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    '.MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    '.MuiOutlinedInput-input': {
      padding: '10px 18px',
    }
  }));

  useEffect(() => {
    setLoad(true);
    const q = query(collection(db, "conges"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newDocs = {};
      querySnapshot.forEach((doc) => {
        newDocs[doc.id] = doc.data();
      });
      setDatasDetailUser(Object.values(newDocs)); // Convertir l'objet en tableau
      setLoad(false);
    });
    setReload(false);
    return () => {
      unsubscribe();
    };
  }, [reload]);


  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(datasDetailUser.map((_, index) => index));
      setSelectAll(true);
    } else {
      setSelectedRows([]);
      setSelectAll(false);
    }
  };

  return (
    <>

      <Box sx={{
        px: 3,
        pt: 5,
      }}>

        <Stack spacing={1}>
          <Typography
            sx={{
              fontSize: 16,
              color: '#BDBDBD'
            }}
          >
            Employes <span></span>
            <Typography
              component='span'
              sx={{
                fontSize: 16,
                color: '#101214'
              }}
            >
              / DetailsEmployé
            </Typography>
          </Typography>
          <Stack direction="row" spacing={2} alignItems='center' flex={1} justifyContent='space-between'>
            <Stack direction="row" spacing={1} alignItems='center'>
              <Box sx={{
                backgroundColor: '#FF3F25',
                width: 6,
                height: 24,
                borderRadius: 12
              }}>

              </Box>
              <Typography
                sx={{
                  fontSize: { xs: 17, sm: 24 },
                  color: '#101214',
                  fontWeight: 600
                }}
              >
                Informations sur l’employé
              </Typography>
            </Stack>

            <StyledSelect
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              size='small'
              value=""
              MenuProps={{
                PaperProps: {
                  style: {
                    boxShadow: '0px 1px 3px 0px #BDBDBD',
                    border: '1px solid #E0E0E0',
                  },
                },
              }}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <Typography sx={{ fontSize: 16 }}>année</Typography>;
                }
                return selected;
              }}
            >
              <MenuItem value="" sx={{ display: 'none' }}>
                <em>Choisir une année</em>
              </MenuItem>
              <MenuItem value={10} sx={{ color: '#101214' }}>2022</MenuItem>
              <MenuItem value={20}>2023</MenuItem>
              <MenuItem value={30}>2024</MenuItem>
            </StyledSelect>
          </Stack>
        </Stack>

      </Box>

      <Box sx={{ border: '1px solid #E6E6E6', my: 3 }} />

      <Box sx={{
        px: 3,

      }}>

        <Grid container rowSpacing={3} columnSpacing={2} mb={5} >
          <Grid item xs={12} sm={6} md={4} >
            <Stack direction='row' spacing={2}>
              <Box sx={{
                width: '90px',
                height: '90px',
                borderRadius: 999,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <img src='https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='img' style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: 999, }} />
              </Box>
              <Stack sx={{ justifyContent: 'space-between', display: { xs: 'none', sm: 'flex', md: 'flex' } }}>
                <Typography sx={{ fontSize: '18px', color: '#101214', fontWeight: 'bold' }}>Alzahed Oudini</Typography>
                <Typography sx={{ fontSize: '15px', color: '#BDBDBD', fontWeight: 'bold' }}>Poste

                  <Typography sx={{ fontSize: '15px', color: '#101214', fontWeight: 'bold' }}>Web dev & UI-UX Designer</Typography>
                </Typography>

              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={8} sx={{}} >
            <Box sx={{ display: 'flex', height: '100%', }}>

              <Stack
                sx={{
                  flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'flex-start', md: 'flex-end' },
                  gap: { xs: 2, sm: 0, md: 10 }
                }} >
                <Stack sx={{ justifyContent: 'space-between', display: { xs: 'flex', sm: 'none', md: 'none' } }}>
                  <Typography sx={{ fontSize: '18px', color: '#101214', fontWeight: 'bold' }}>Alzahed Oudini</Typography>
                  <Typography sx={{ fontSize: '15px', color: '#BDBDBD', fontWeight: 'bold' }}>Poste

                    <Typography sx={{ fontSize: '15px', color: '#101214', fontWeight: 'bold' }}>Web dev & UI-UX Designer</Typography>
                  </Typography>

                </Stack>
                <Stack>
                  <Typography sx={{ fontSize: '15px', color: '#BDBDBD', fontWeight: 'bold' }}>Téléphone</Typography>
                  <Typography sx={{ fontSize: '15px', color: '#101214', fontWeight: 'bold' }}>+237 657 250 527</Typography>
                </Stack>
                <Stack>
                  <Typography sx={{ fontSize: '15px', color: '#BDBDBD', fontWeight: 'bold' }}>Adresse email</Typography>
                  <Typography sx={{ fontSize: '15px', color: '#101214', fontWeight: 'bold' }}>Alzahedoudini@gmail.com</Typography>
                </Stack>

              </Stack>
            </Box>
          </Grid>

          {
            datasCard.map((i, index) => {
              return (
                <Fragment key={index}>
                  <Grid item xs={12} sm={6} md={3} sx={{}}>
                    <Card
                      icon={i.icone}
                      name={i.name}
                      downName={i.downName}
                    />
                  </Grid>
                </Fragment>
              )
            })
          }


        </Grid>

      </Box>
      <Box sx={{ border: '1px solid #E6E6E6', my: 3 }} />
      <Box sx={{
        px: 3,
        mb: 12,
      }}>
        <TableContainer sx={{ minWidth: '100%', mt: 2, whiteSpace: 'nowrap', overflowX: 'auto', '&::-webkit-scrollbar': { height: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#FF3F25', borderRadius: '8px' }, '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#FF5733' }, '&::-webkit-scrollbar-track': { backgroundColor: '#F0F0F0', borderRadius: '8px' } }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F9F9F9" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < datasDetailUser.length}
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />

                </TableCell>
                {

                  datasDetailHead.head.map((i, index) => {
                    return (
                      <TableCell key={index}>
                        <Stack direction='row' alignItems="center" spacing={2}>
                          <Typography sx={{ color: '#101214', fontWeight: "bold" }}>{i.name}</Typography>
                          <img src={i.icone} alt={i.name} width={6} height={10} />
                        </Stack>
                      </TableCell>
                    )
                  })

                }
              </TableRow>

            </TableHead>
            {datasDetailUser.length > 0 && (
              <TableEmployment
                datasTab={datasDetailUser}
                nameTab="datasDetailUser"
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                setSelectAll={setSelectAll}
              />
            )}
          </Table>
        </TableContainer>
        {/* <TableEmployment
          datasTab={datasDetailUser}
          nameTab="datasDetailUser"
        /> */}
      </Box>
    </>


  )
}

export default DetailUser
