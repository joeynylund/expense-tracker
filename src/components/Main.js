import React, { useState, useEffect } from 'react';
import { Spinner, FormFeedback, Button, Form, FormGroup, Label, Input, Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import Nav from './Nav.js';
import Moment from 'react-moment';
import { firebase, firestore } from '../config/firebase';
import { Doughnut, Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faTheaterMasks, faShoppingBag, faHamburger, faDollarSign, faTrash, faAsterisk, faPiggyBank } from "@fortawesome/free-solid-svg-icons";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const pagination = paginationFactory({
  page: 1,
  sizePerPage: 10,
  lastPageText: '>>',
  firstPageText: '<<',
  nextPageText: '>',
  prePageText: '<',
  showTotal: false,
  alwaysShowAllBtns: false,
  hidePageListOnlyOnePage: true,
  hideSizePerPage: true
});

const MonthlyChart = (props) => {
  var monthData = []
  var monthsReverse = props.months.reverse()
  monthsReverse.forEach(month => {
    var total = 0;
    props.initialData.forEach(transaction => {
      if(transaction.type === 'withdrawl' && transaction.time === month){
        total += transaction.value
      }
    })
    monthData.push(total)
  })
  const data ={
    labels: props.months.reverse(),
    datasets: [
      {
        label: '($) Money Spent',
        data: monthData.reverse(),
        backgroundColor: 'rgb(255,0,0)',
        borderColor: 'rgba(255,0,0,0.2)'
      }
    ]
  }

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    plugins: {
      legend: {
        display: false,
      }
    },
    animation: {
      duration: 0
    }
  };
  return (
    <Line data={data} options={options} />
  )
}

const CategoryChart = (props) => {
  var food = props.food;
  var bills = props.bills;
  var entertainment = props.entertainment;
  var shopping = props.shopping;
  var other = props.other;
  const data = {
    labels: ['Food', 'Bills', 'Entertainment', 'Shopping', 'Other'],
    datasets: [
      {
        data: [food, bills, entertainment, shopping, other],
        backgroundColor: [
          '#EF281E',
          '#f6a229',
          '#0881cd',
          '#fcf532',
          '#a229f6',
        ],
        borderColor: [
          '#EF281E',
          '#f6a229',
          '#0881cd',
          '#fcf532',
          '#a229f6',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      }
    },
    animation: {
      duration: 0
    }
    
  };
  return (
    <Doughnut data={data} options={options} />
  )
}

const ExpenseChart = (props) => {
  var income = props.income;
  var expense = props.expenses;
  const data = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: [
          '#00BC58',
          '#EF281E'
        ],
        borderColor: [
          '#00BC58',
          '#EF281E'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      }
    },
    animation: {
      duration: 0
    }
    
  };
  return (
    <Doughnut data={data} options={options} style={{width:'50%'}} />
  )
}

const Main = (props) => {

  const db = firestore.collection('users').doc(props.user.uid).collection('transactions');
  const [startDate, setStartDate] = useState(new Date());
  const [type, setType] = useState('');
  const [allTransactions, setAllTransactions] = useState([]);
  const [addError, setAddError] = useState('')
  const [deposit, setDeposit] = useState(0);
  const [depositError, setDepositError] = useState('')
  const [purchase, setPurchase] = useState(0);
  const [purchaseError, setPurchaseError] = useState('');
  const [store, setStore] = useState('');
  const [storeError, setStoreError] = useState('');
  const [category, setCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [months, setMonths] = useState([]);
  const [income, setIncome] = useState(0);
  const [allIncome, setAllIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [allExpense, setAllExpense] = useState(0);
  const [food, setFood] = useState(0);
  const [bills, setBills] = useState(0);
  const [entertainment, setEntertainment] = useState(0);
  const [shopping, setShopping] = useState(0);
  const [other, setOther] = useState(0);
  const [allFood, setAllFood] = useState(0);
  const [allBills, setAllBills] = useState(0);
  const [allEntertainment, setAllEntertainment] = useState(0);
  const [allShopping, setAllShopping] = useState(0);
  const [allOther, setAllOther] = useState(0);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const toggle = () => setModal(!modal);

  const handleDeposit = e => {
    setDepositError('')
    setDeposit(e.target.value)
  }

  const handlePurchase = e => {
    setPurchaseError('')
    setPurchase(e.target.value)
  }

  const handleStore = e => {
    setStoreError('')
    setStore(e.target.value)
  }

  const handleCategory = e => {
    setCategoryError('')
    setCategory(e.target.value)
  }

  function categoryFormat(cell,row) {
  
    switch(row.category){
      case 'FOOD':
        return (
          <div className='food-gradient'><FontAwesomeIcon icon={faHamburger} size='2x' color='#fff' /></div>
        )
      case 'PAYCHECK':
        return (
          <div className='paycheck-gradient'><FontAwesomeIcon icon={faDollarSign} size='2x' color='#fff' /></div>
        )
      case 'ENTERTAINMENT':
        return (
          <div className='entertainment-gradient'><FontAwesomeIcon icon={faTheaterMasks} size='2x' color='#fff' /></div>
        )
      case 'BILLS':
        return (
          <div className='bills-gradient'><FontAwesomeIcon icon={faPiggyBank} size='2x' color='#fff' /></div>
        )
      case 'SHOPPING':
        return (
          <div className='shopping-gradient'><FontAwesomeIcon icon={faShoppingBag} size='2x' color='#fff' /></div>
        )
      case 'OTHER':
        return (
          <div className='other-gradient'><FontAwesomeIcon icon={faAsterisk} size='2x' color='#fff' /></div>
        )
    }
  }
  
  function merchantFormat(cell,row,rowIndex) {
    
    return (
      <div>
        <h4 style={{margin:'0',fontWeight:'700'}}>{cell}</h4>
        <p style={{fontSize:'14px',margin:'0px'}}><Moment format="MMMM DD, YYYY">{transactions[rowIndex].date * 1000}</Moment></p>
      </div>
    )
  }

  const columns = [
    {dataField: 'category', text:'transaction.category', align: 'center', formatter: categoryFormat, headerAttrs: {hidden: true},style:{width:'70px'},hidden: window.innerWidth < 480 ? true : false},
    {dataField: 'merchant', text:'transaction.category', formatter: merchantFormat, headerAttrs: {hidden: true}},
    {dataField: 'money', text:'transaction.category', align: 'right', formatter: moneyFormat, headerAttrs: {hidden: true}},
  ];

  const rowClasses = (row, rowIndex) => {
    let classes = null;
  
      classes = row.category;
  
    return classes;
  };
  

  const add = () => {
    console.log(deposit)
    if(type === '') {
      setAddError('Select a Transaction Type!')
    }
    if(type === 'deposit') {
      if(deposit === null || deposit === 0 || deposit === '' || deposit ==='0') {
        setDepositError('Your deposit cannot be empty or $0!')
      } else {
        const data = {
          category: 'paycheck',
          type: type,
          date: startDate,
          value: parseInt(deposit)
        };
        db.add(data)
        setModal(!modal)
        setStartDate(new Date())
      }
      
    }
    if(type === 'withdrawl') {
      var validation = 0;

      if(store === '') {
        setStoreError('Your store or bill name cannot be empty!')
      } else {
        validation++
      }
      
      if (category === '') { 
        setCategoryError('You must select a category!')
      } else {
        validation++
      }
      
      if (purchase === null || purchase === 0 || purchase === '' || purchase === '0') {
        setPurchaseError('Your purchase cannot be empty or $0!')
      } else {
        validation++
      }
      
      if(validation === 3) {
        const data = {
          category: category,
          type: type,
          merchant: store,
          date: startDate,
          value: parseInt(purchase)
        };
        db.add(data)
        setModal(!modal)
        setStartDate(new Date())
      }
    }
  }

  const handleTime = e => {
    console.log(e.target.value)
    if(e.target.value !== 'all'){
      var income = 0
      var expenses = 0
      var food = 0
      var entertainment = 0 
      var bills = 0 
      var shopping = 0
      var other = 0
      const filtered = allTransactions.filter(transaction => transaction.time === e.target.value)
      console.log(filtered)
      filtered.forEach(transaction => {
        if(transaction.type === 'withdrawl') {
          expenses += transaction.value
        } else {
          income += transaction.value
        }

        switch(transaction.category){
          case 'FOOD':
            food += transaction.value;
            break;
          case 'ENTERTAINMENT':
            entertainment += transaction.value;
            break;
          case 'SHOPPING':
            shopping += transaction.value;
            break;
          case 'BILLS':
            bills += transaction.value;
            break;
          case 'OTHER':
            other += transaction.value;
            break;
        }
      })
      setIncome(income)
      setExpense(expenses)
      setTransactions(filtered)
      setFood(food)
      setBills(bills)
      setEntertainment(entertainment)
      setShopping(shopping)
      setOther(other)
    }
    if(e.target.value === 'all'){
      setIncome(allIncome)
      setExpense(allExpense)
      setTransactions(allTransactions)
      setFood(allFood)
      setBills(allBills)
      setEntertainment(allEntertainment)
      setShopping(allShopping)
      setOther(allOther)
    }
  }

  const remove = (props) => {
    db.doc(props).delete();
  }

  function moneyFormat(cell,row,rowIndex) {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
        <UncontrolledDropdown direction="left">
          <DropdownToggle nav>
            <div style={{display:'flex',alignItems:'center'}}>
              <h5 style={{margin:'0',color:'#000',fontWeight:'700',display:'inline',marginRight:'10px'}}><span style={{color:'lightgreen',marginRight:'5px'}}>{row.type === 'deposit' ? '+' : null}</span>{cell}</h5>
              <FontAwesomeIcon icon={faEllipsisV} color="#000" />
            </div>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => {remove(row.id)}}>
            <FontAwesomeIcon icon={faTrash} /> Delete
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    )
  }

  useEffect(() => {
    db
    .orderBy('date', 'desc')
    .onSnapshot(
      querySnapshot => {
        var total = 0
        var income = 0
        var expense = 0
        var food = 0
        var bills = 0
        var entertainment = 0
        var shopping = 0
        var other = 0
        var months = []
        const newEntities = []
        querySnapshot.forEach(doc => {
          const entity = doc.data()
          entity.id = doc.id
          if(entity.category === 'food') {
            food += entity.value
          }
          if(entity.category === 'bills') {
            bills += entity.value
          }
          if(entity.category === 'entertainment') {
            entertainment += entity.value
          }
          if(entity.category === 'shopping') {
            shopping += entity.value
          }
          if(entity.category === 'other') {
            other += entity.value
          }
          entity.money = (doc.data().value).toLocaleString('en-us', {style:'currency',currency:'USD'})
          entity.category = doc.data().category.toUpperCase()
          if (doc.data().merchant === undefined) {
            entity.merchant = 'Income'
          }
          entity.date = doc.data().date.seconds
          var date = new Date(doc.data().date.seconds * 1000)
          entity.time = new Intl.DateTimeFormat('en-US', {month:'long'}).format(date) + ' ' + date.getFullYear()
          newEntities.push(entity)
          if(months.includes(entity.time) === false) {
            months.push(entity.time)
          }
          if(entity.type === 'deposit') {
            total += entity.value
            income += entity.value
          } else {
            total -= entity.value
            expense += entity.value
          }
        });
        var month = newEntities.filter(transaction => transaction.time === months[0])
        setTotal(total)
        setIncome(income)
        setAllIncome(income)
        setExpense(expense)
        setAllExpense(expense)
        setFood(food)
        setBills(bills)
        setEntertainment(entertainment)
        setShopping(shopping)
        setOther(other)
        setAllFood(food)
        setAllBills(bills)
        setAllEntertainment(entertainment)
        setAllShopping(shopping)
        setAllOther(other)
        setMonths(months)
        setTransactions(month)
        setAllTransactions(newEntities)
        setLoading(false)
      },
      error => {
      }
    )
  }, [])
    
  return (
    <>
      <Nav displayname={props.user.displayName} />
      <Container style={{marginTop:'20px'}}>
        {loading === true ? <Row><Col md='12'><div style={{display:'flex',justifyContent:'center'}}><Spinner type="grow" style={{ width: '5rem', height: '5rem', color: '#710272' }} /></div></Col></Row> :
        <Row>
          <Col md='8'>
            <Row>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexDirection:'row',width:'100%'}}>
              {months.length !== 0 && <h1 style={{display:'inline-block'}}><b>Your Transactions</b></h1>}

              {transactions.length > 0 &&<FormGroup>
                <Input type='select' onChange={handleTime}>
                  {months.map((month,index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </Input>
              </FormGroup>}
              </div>
            </Row>
            <BootstrapTable keyField='id' data={transactions} columns={columns} pagination={pagination} bordered={false} rowClasses={rowClasses} noDataIndication="Add a Transaction to get started tracking your finances!" />
          </Col>
          <Col md='4'>
            <div style={{position:'sticky',top:'15px'}}>
              <Button color='primary' style={{width:'100%',padding:'20px',marginBottom:'20px'}} onClick={toggle}>Add Transaction</Button>
              {months.length > 1 && <div><p style={{textAlign:'center'}}>Monthly Spend</p><MonthlyChart initialData={allTransactions} months={months} /></div>}
              {transactions.length > 0 && expense > 0 && <Row>
                <Col md='6' xs='6'><p style={{textAlign:'center',marginTop:'15px'}}>Income vs Expenses</p>
                  <ExpenseChart income={income} expenses={expense} /></Col>
                <Col md='6' xs='6'><p style={{textAlign:'center',marginTop:'15px'}}>Expenses</p>
                  <CategoryChart food={food} bills={bills} entertainment={entertainment} shopping={shopping} other={other} /></Col>
              </Row>}
            </div>
          </Col>
        </Row>}
      </Container>
      <Modal isOpen={modal} toggle={toggle} centered={true} onClosed={() => {
        setAddError('')
        setType('')
        setDeposit(0)
        setStore('')
        setCategory('')
        setPurchase(0)
        setDepositError('')
        setStoreError('')
        setCategoryError('')
        setPurchaseError('')
        }}>
        <ModalHeader toggle={toggle}>Add Transaction</ModalHeader>
        <ModalBody>
          <Row style={{padding:'15px'}}>
            <Col style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'10px',}}>
              <div onClick={() => {
                if(type === 'deposit') {
                  setType('')
                } else {
                  setType('deposit')
                }
                setAddError('')
              }} style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',borderRadius:'5px',width:'100%',cursor:'pointer'}} className={ type === 'deposit' ? 'deposit-selected' : 'deposit' }>
                <h5 style={{margin:'0px'}}>Deposit</h5>
              </div>
            </Col>
            <Col style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'10px',}}>
              <div onClick={() => {
                if(type === 'withdrawl') {
                  setType('')
                } else {
                  setType('withdrawl')
                }
                setAddError('')
              }} style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',borderRadius:'5px',width:'100%',cursor:'pointer'}} className={type === 'withdrawl' ? 'withdrawl-selected' : 'withdrawl'}>
                <h5 style={{margin:'0px'}}>Withdrawal</h5>
              </div>
            </Col>
          </Row>
          {type === 'deposit' && 
            <Form>
              <FormGroup>
                <Label>Deposit Amount</Label>
                <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText><FontAwesomeIcon icon={faDollarSign} /></InputGroupText>
                </InputGroupAddon>
                <Input type='number' value={deposit === 0 ? '' : deposit} onChange={handleDeposit} min='0' invalid={depositError === '' ? false : true} />
                <FormFeedback>{depositError}</FormFeedback>
                </InputGroup>
              </FormGroup>
              <FormGroup style={{textAlign:'center',marginTop:'15px'}}>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date)
                  console.log(date)
                }}
                maxDate={new Date()}
                inline
              />
              </FormGroup>
            </Form> }

          {type === 'withdrawl' && 
            <Form>
              <FormGroup>
                <Label>Store or Bill Name:</Label>
                <Input type='text' value={store} onChange={handleStore} invalid={storeError === '' ? false : true} />
                <FormFeedback>{storeError}</FormFeedback>
              </FormGroup>
              <FormGroup style={{marginTop:'15px'}}>
                <Label>Purchase Category:</Label>
                <Input type='select' value={category} onChange={handleCategory} invalid={categoryError === '' ? false : true}>
                  <option value=''>Select a Category</option>
                  <option value='food'>Food</option>
                  <option value='bills'>Bills & Utilities</option>
                  <option value='entertainment'>Entertainment</option>
                  <option value='shopping'>Shopping</option>
                  <option value='other'>Other</option>
                </Input>
                <FormFeedback>{categoryError}</FormFeedback>
              </FormGroup>
              <FormGroup style={{marginTop:'15px'}}>
                <Label>Purchase Amount</Label>
                <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText><FontAwesomeIcon icon={faDollarSign} /></InputGroupText>
                </InputGroupAddon>
                <Input type='number' value={purchase === 0 ? '' : purchase} onChange={handlePurchase} min='0' invalid={purchaseError === '' ? false : true} />                
                <FormFeedback>{purchaseError}</FormFeedback>
                </InputGroup>
              </FormGroup>
              <FormGroup style={{textAlign:'center',marginTop:'15px'}}>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date)
                  console.log(date)
                }}
                maxDate={new Date()}
                inline
              />
              </FormGroup>
            </Form> }
          
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={add}>Add Transaction</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>

    </>
    
  );
}

export default Main;