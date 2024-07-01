import { Avatar, Box, Checkbox, Chip, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../../Firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const TableEmployment = ({ nameTab, datasTab, selectedRows, setSelectedRows, setSelectAll, position }) => {

  const location = useLocation();
  const [datasTabFilter, setDatasTabFilter] = useState([]);
  const [daysOff, setDaysOff] = useState({});
  const [otherAbsences, setOtherAbsences] = useState({})
  const [year, setYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();
  const conges = 25;

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/dashboard') {
      setDatasTabFilter(datasTab.slice(0, 2));
    } else {
      setDatasTabFilter(datasTab);
    }
  }, [datasTab, location.pathname]);

  // useEffect(() => {
  //   const fetchDaysOff = async () => {
  //     const daysOffData = {};
  //     const otherAbsencesData = {};
  //     for (const i of datasTab) {
  //       daysOffData[i.matricule] = await fetchDocuments(i.matricule, year);
  //       otherAbsencesData[i.matricule] = await fetchOtherAbsencesDocuments(i.matricule, year);
  //     }
  //     setDaysOff(daysOffData);
  //     setOtherAbsences(otherAbsencesData);
  //   };

  //   fetchDaysOff();
  // }, [datasTab, year]);


  const timestampToDate = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp.seconds * 1000);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    return date.toLocaleDateString('fr-FR', options);
  };

  // const fetchDocuments = async (matricule, year) => {
  //   try {
  //     const startOfYear = new Date(year, 0, 1);
  //     const endOfYear = new Date(year, 11, 31, 23, 59, 59);

  //     const q = query(
  //       collection(db, 'conges'),
  //       where('matricule', '==', matricule),
  //       where('typeAbscence', '==', 'Congés payé'),
  //       where('dateDebut', '>=', startOfYear),
  //       where('dateDebut', '<=', endOfYear)
  //     );

  //     const querySnapshot = await getDocs(q);
  //     let totalDays = 0;

  //     querySnapshot.forEach((doc) => {
  //       const data = doc.data();
  //       const dateDebut = data.dateDebut.toDate();
  //       const dateFin = data.dateFin.toDate();

  //       const diffTime = Math.abs(dateFin - dateDebut);
  //       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  //       totalDays += diffDays;
  //     });

  //     return totalDays;
  //   } catch (error) {
  //     console.error('Erreur lors de la récupération des documents :', error);
  //   }
  // };

  // const fetchOtherAbsencesDocuments = async (matricule, year) => {
  //   try {
  //     const startOfYear = new Date(year, 0, 1);
  //     const endOfYear = new Date(year, 11, 31, 23, 59, 59);

  //     const q = query(
  //       collection(db, 'conges'),
  //       where('matricule', '==', matricule),
  //       where('typeAbscence', '==', 'Autre Abscence'),
  //       where('dateDebut', '>=', startOfYear),
  //       where('dateDebut', '<=', endOfYear)
  //     );

  //     const querySnapshot = await getDocs(q);
  //     let totalDays = 0;

  //     querySnapshot.forEach((doc) => {
  //       const data = doc.data();
  //       const dateDebut = data.dateDebut.toDate();
  //       const dateFin = data.dateFin.toDate();

  //       const diffTime = Math.abs(dateFin - dateDebut);
  //       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  //       totalDays += diffDays;
  //     });

  //     return totalDays;
  //   } catch (error) {
  //     console.error('Erreur lors de la récupération des documents :', error);
  //   }
  // };

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

  const handleClick = (employe) => {
    if (nameTab === "datasEmployes") {
      navigate(`/employes/${employe.matricule}`, { state: employe });
      return
    }
  }

  return (
    <TableBody>
      {
        datasTabFilter.length > 0 && (
          datasTabFilter.map((i, index) => {
            return (
              <TableRow key={index} sx={{
                bgcolor: selectedRows.includes(index) ? '#E0F7FA' : 'inherit',
                backgroundColor: index >= 1 && index % 2 === 1 ? '#F9F9F9' : 'inherit',
                '&:hover': {
                  backgroundColor: '#E0F7FA', // Couleur de fond lorsqu'on survole la ligne
                  cursor: 'pointer' // Curseur de souris en main
                }
              }}

                // selected={selectedRows.includes(index)}
                // onClick={() => handleSelectRow(index)}
                onClick={() => handleClick(i)}
              >
                {/* {
                  nameTab === "datasEmployes" || nameTab === "datasDetailUser" ? (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.includes(index)}
                        onChange={() => handleSelectRow(index)}
                      />
                    </TableCell>
                  ) : ''
                } */}
                {
                  nameTab === "datasEmployes" ? (
                    <>
                      <TableCell >
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>{i.matricule}</Typography>
                      </TableCell>
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
                           <Avatar sx={{ backgroundColor: 'orange' }}>
                           {i.prenom.charAt(0)}{i.nom.charAt(0)}
                           </Avatar>
                          </Box>
                          <Box sx={{ border: '1px solid #E6E6E6', height: '26px' }} />
                          <Stack>
                            <Typography sx={{ color: '#101214', fontSize: '16px', fontWeight: 'bold' }}>{i.prenom} {i.nom} </Typography>
                            <Typography sx={{ color: '#BDBDBD', fontSize: '14px', fontWeight: 'bold' }}>{i.poste}</Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell >
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>{i.dateDebut}</Typography>
                      </TableCell>

                      <TableCell >
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>{i.telephone}</Typography>
                      </TableCell>
                      <TableCell >
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>{i.email}</Typography>
                      </TableCell>
                      {/* <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Box sx={{ width: 5, height: 5, borderRadius: 999, backgroundColor: '#101214' }} />
                          <Box sx={{ width: 5, height: 5, borderRadius: 999, backgroundColor: '#101214' }} />
                          <Box sx={{ width: 5, height: 5, borderRadius: 999, backgroundColor: '#101214' }} />
                        </Stack>
                      </TableCell> */}
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
                      {/* <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Box sx={{ width: 5, height: 5, borderRadius: 999, backgroundColor: '#101214' }} />
                          <Box sx={{ width: 5, height: 5, borderRadius: 999, backgroundColor: '#101214' }} />
                          <Box sx={{ width: 5, height: 5, borderRadius: 999, backgroundColor: '#101214' }} />
                        </Stack>
                      </TableCell> */}
                    </>
                  ) : (
                    <>

                      <TableCell
                        sx={{
                          display: position ? 'none' : 'table-cell'
                        }}
                      >
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>{i.matricule}</Typography>
                      </TableCell>


                      <TableCell>
                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>{i.employe}</Typography>
                      </TableCell>
                      <TableCell >
                        <Typography
                          sx={{
                            color: i.conges && i.conges > 25 ? '#FF0000' : '#101214',
                            fontWeight: 'bold',
                            fontSize: '16px'
                          }}
                        >
                          {i.conges ? `${i.conges} / ${conges}` : i.conges === 0 ? i.conges : 'Chargement...'}
                        </Typography>

                      </TableCell>
                      <TableCell >

                        <Typography sx={{ color: '#101214', fontWeight: "bold", fontSize: '16px' }}>
                          {i.autresAbsences ? i.autresAbsences : i.autresAbsences === 0 ? i.autresAbsences : 'Chargement...'}
                        </Typography>

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
