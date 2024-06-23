import { Box, Checkbox, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../../Firebase/firebaseConfig';

const TableEmployment = ({ nameTab, datasTab, selectedRows, setSelectedRows, setSelectAll }) => {
  const location = useLocation();
  const [datasTabFilter, setDatasTabFilter] = useState([]);
  const [daysOff, setDaysOff] = useState({});

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/dashboard') {
      setDatasTabFilter(datasTab.slice(0, 2));
    } else {
      setDatasTabFilter(datasTab);
    }
  }, [datasTab, location.pathname]);

  useEffect(() => {
    const fetchDaysOff = async () => {
      const daysOffData = {};
      for (const i of datasTab) {
        daysOffData[i.matricule] = await fetchDocuments(i.matricule);
      }
      setDaysOff(daysOffData);
    };

    fetchDaysOff();
  }, [datasTab]);

  const timestampToDate = (timestamp) => {
    if (!timestamp) return ''; 

    const date = new Date(timestamp.seconds * 1000);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    return date.toLocaleDateString('fr-FR', options);
  };
  
  const fetchDocuments = async (matricule) => {
    try {
      const q = query(collection(db, 'conges'), where('matricule', '==', matricule));
      const querySnapshot = await getDocs(q);
      let totalDays = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dateDebut = data.dateDebut.toDate();
        const dateFin = data.dateFin.toDate();

        const diffTime = Math.abs(dateFin - dateDebut);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        totalDays += diffDays;
      });

      return totalDays;
    } catch (error) {
      console.error('Erreur lors de la récupération des documents :', error);
    }
  };

  const handleSelectRow = (index) => {
    const selectedIndex = selectedRows.indexOf(index);
    let newSelectedRows = [];

    if (selectedIndex === -1) {
      newSelectedRows = newSelectedRows.concat(selectedRows, index);
    } else if (selectedIndex === 0) {
      newSelectedRows = newSelectedRows.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelectedRows = newSelectedRows.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedRows = newSelectedRows.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }

    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.length === datasTabFilter.length);
  };

  return (
    <TableBody>
      {
        datasTabFilter.length > 0 && (
          datasTabFilter.map((i, index) => {
            return (
              <TableRow key={index} sx={{
                bgcolor: selectedRows.includes(index) ? '#E0F7FA' : 'inherit',
                backgroundColor: index >= 1 && index % 2 === 1 ? '#F9F9F9' : 'inherit',
              }}
                selected={selectedRows.includes(index)}
                onClick={() => handleSelectRow(index)}
              >
                {
                  nameTab === "datasEmployes" || nameTab === "datasDetailUser" ? (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.includes(index)}
                        onChange={() => handleSelectRow(index)}
                      />
                    </TableCell>
                  ) : ''
                }
                {
                  nameTab === "datasEmployes" ? (
                    <>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: 999,
                              justifyContent: 'center',
                              alignItems: 'center',
                              display: 'flex'
                            }}
                          >
                            <img src='https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='user' width='100%' height='100%' style={{ borderRadius: 999, objectFit: 'cover' }} />
                          </Box>
                          <Box sx={{ border: '1px solid #E6E6E6', height: '26px' }} />
                          <Stack>
                            <Typography sx={{ color: '#101214', fontSize: '16px', fontWeight: 'bold' }}>{i.nom}</Typography>
                            <Typography sx={{ color: '#BDBDBD', fontSize: '14px', fontWeight: 'bold' }}>{i.poste}</Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell >
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>{i.dateDebut}</Typography>
                      </TableCell>
                      <TableCell >
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>{i.matricule}</Typography>
                      </TableCell>
                      <TableCell >
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>{i.telephone}</Typography>
                      </TableCell>
                      <TableCell >
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>{i.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Box sx={{ width: 5, height: 5, borderRadius: 999, backgroundColor: '#101214' }} />
                          <Box sx={{ width: 5, height: 5, borderRadius: 999, backgroundColor: '#101214' }} />
                          <Box sx={{ width: 5, height: 5, borderRadius: 999, backgroundColor: '#101214' }} />
                        </Stack>
                      </TableCell>
                    </>
                  ) : nameTab === "datasDetailUser" ? (
                    <>
                      <TableCell >
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>{i.typeAbscence}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>
                          {timestampToDate(i.dateDebut)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>
                          {timestampToDate(i.dateFin)}
                        </Typography>
                      </TableCell>
                      <TableCell >
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>{i.motif}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Box sx={{ width: 5, height: 5, borderRadius: 999, backgroundColor: '#101214' }} />
                          <Box sx={{ width: 5, height: 5, borderRadius: 999, backgroundColor: '#101214' }} />
                          <Box sx={{ width: 5, height: 5, borderRadius: 999, backgroundColor: '#101214' }} />
                        </Stack>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>{i.employe}</Typography>
                      </TableCell>
                      <TableCell >
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>
                          {daysOff[i.matricule] !== undefined ? daysOff[i.matricule] : 'Chargement...'}
                        </Typography>
                      </TableCell>
                      <TableCell >
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>3</Typography>
                      </TableCell>
                    </>
                  )
                }
              </TableRow>
            )
          })
        )
      }
    </TableBody>
  )
}

export default TableEmployment;