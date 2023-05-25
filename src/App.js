import logo from './logo.svg';
import './App.css';
import { MDBBtn, MDBCheckbox, MDBContainer, MDBInput, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBRadio } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { BREAD_PRICE, FLAVOUR_PRICE, INGREDIENTS } from './constants/Constants';
import { Fragment, useEffect, useState } from 'react';
import { saveDailyData, savePhoneNumber } from './config/redux/actions/mainAction';
import toSentenceCase from './utlis/toSentenceCase';
import Swal from 'sweetalert2'

function App(props) {
  const dispatch = useDispatch()
  const orderList = useSelector(state => state.main.orderListData)
  const savedPhoneNumber = useSelector(state => state.main.phoneNumber)
  const [breadSize, setbreadSize] = useState('')
  const [order, setorder] = useState({
    bread: '',
    flavour: '',
    price: 0,
    quantity: 1
  })
  const [view, setview] = useState('SELL');
  const [allShopping, setallShopping] = useState([]);
  const toggleShow = () => setBasicModal(!basicModal);
  const [basicModal, setBasicModal] = useState(false);
  const toggleShow2 = () => setBasicModal2(!basicModal2);
  const [basicModal2, setBasicModal2] = useState(false);
  const [ingredientsPrice, setingredientsPrice] = useState({ ...INGREDIENTS })

  const onHandleSetOrder = (e) => {
    let values = JSON.parse(e.target.value)

    if (values.name.includes('Polos')) {
      setbreadSize('big')
    }

    setorder({
      ...order,
      flavour: values.name,
      price: values[breadSize]
    })
  }

  const onChangeQuantityOrder = (e) => {
    setorder({
      ...order,
      quantity: e.target.value
    })
  }

  const onHandleSaveOrder = () => {
    let amount = (parseInt(order.price)) * parseInt(order.quantity)
    let orderName = `${breadSize == 'small' ? 'Roti Kecil' : 'Roti Besar'} + ${order.flavour}`
    orderList.push({ orderName: orderName, amount: amount, quantity: order.quantity })
    dispatch(saveDailyData(orderList))
    setorder({
      bread: '',
      flavour: '',
      price: 0,
      quantity: 1
    })
    setbreadSize('')
  }

  const onHandlePrintOrder = () => {
    let w = new Date().toLocaleString()
    let totalAmount = 0
    let v = orderList.map(v => {
      totalAmount = parseInt(totalAmount) + v.amount
      return (`%0A%2D%20${v.quantity}%20${v.orderName.replace('+', '%2B')}%20:%20Rp.%20${v.amount.toLocaleString('ID')}`)
    })

    window.open(`https://api.whatsapp.com/send?phone=${savedPhoneNumber}&text=${w}%0A%0A•%20Penjualan%0A${v}%0A%0ATotal%20=%20Rp.%20${totalAmount.toLocaleString('ID')}`, '_blank')
    dispatch(saveDailyData([]))
    toggleShow2()
  }

  const onHandlePrintShopping = () => {
    let w = new Date().toLocaleString()
    let totalAmount = 0
    let v = allShopping.map(v => {
      totalAmount = parseInt(totalAmount) + v.totalPerItem
      return (`%0A%2D%20${v.qty}%20${v.name}%20:%20Rp.%20${v.totalPerItem.toLocaleString('ID')}`)
    })

    window.open(`https://api.whatsapp.com/send?phone=${savedPhoneNumber}&text=${w}%0A%0A•%20Pembelanjaan%0A${v}%0A%0ATotal%20=%20Rp.%20${totalAmount.toLocaleString('ID')}`, '_blank')
    setallShopping([])
    setingredientsPrice({ ...INGREDIENTS })
    toggleShow()
  }

  const onHandleAddShopping = (e, category, name) => {
    let names = e.target.name.includes('_') ? name : e.target.name
    let values = e.target.value.replace(',', '.')
    setingredientsPrice({
      ...ingredientsPrice,
      [category]: {
        ...ingredientsPrice[category],
        [names]: e.target.value.includes('.') ? parseFloat(values) : (parseInt(values))
      }
    })
  }

  const onHandleResultShopping = () => {
    if (savedPhoneNumber == null || savedPhoneNumber == '') {
      Swal.fire({
        title: 'Data tidak bisa diproses',
        text: 'Anda belum mengisi nomor handphone',
        icon: 'warning'
      })
    } else {
      let allShoppingItem = []
      Object.entries(ingredientsPrice).map((x, y) => {
        if (x[1].qty != 0) {
          allShoppingItem.push({ pricePerItem: x[1].price, qty: x[1].qty, name: x[0], totalPerItem: x[1].price * x[1].qty })
        }
      })

      setallShopping(allShoppingItem)
      toggleShow()
    }
  }

  const onHandleDeleteItem = (id) => {
    let val = [...allShopping]
    val.splice(id, 1)
    setallShopping(val)
  }

  const onHandleDeleteOrder = (id) => {
    let val = [...orderList]
    val.splice(id, 1)
    dispatch(saveDailyData(val))
  }

  return (
    <Fragment>
      <h1 className='text-center mt-3'><b><i>Mimiti Data Recap</i></b></h1>
      <MDBContainer className='pt-3'>
        <div style={{ fontSize: '11px' }} className='mb-3'>
          Isi nomor hp dibawah ini agar rekap data dapat dikirimkan ke whatsapp. <br />
          Ubah terlebih dahulu angka awal 08 menjadi 62, contoh nomor HP-nya 089112233 menjadi 6289112233
        </div>
        <MDBInput type='number' placeholder='Contoh: 628972871364' label='Nomor HP' onChange={(e) => dispatch(savePhoneNumber(e.target.value))} name='phoneNumber' value={savedPhoneNumber} />
      </MDBContainer>
      <MDBContainer className='pt-3 pb-5'>
        <div className='d-flex justify-content-between align-items-center'>
          <h2>{view == 'SHOP' ? 'Halaman Pembelanjaan' : 'Halaman Penjualan'}</h2>
          <div>
            <MDBBtn size='sm' onClick={() => setview('SHOP')} hidden={view == 'SHOP' ? true : false}>Pindah Halaman Penjualan</MDBBtn>
            <MDBBtn size='sm' onClick={() => setview('SELL')} hidden={view == 'SELL' ? true : false}>Pindah Halaman Pembelanjaan</MDBBtn>
          </div>
        </div>
        {
          view == 'SHOP' ?
            <MDBContainer className='mx-0 mt-5'>
              {
                ingredientsPrice != null &&
                // ***1PEMBELANJAAN*** //
                <>
                  <div className='d-flex mb-3' style={{ gap: '10px' }}>
                    <MDBRadio checked={ingredientsPrice.MARGARIN.qty == 0.5 ? true : false} value={0.5} onClick={(e) => onHandleAddShopping(e, 'MARGARIN', 'qty')} name='qty_margarin' label='1/2' />
                    <MDBRadio checked={ingredientsPrice.MARGARIN.qty == 0.25 ? true : false} value={0.25} onClick={(e) => onHandleAddShopping(e, 'MARGARIN', 'qty')} name='qty_margarin' label='1/4' />
                  </div>
                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'MARGARIN')} name='qty' value={ingredientsPrice.MARGARIN.qty} className='flex-fill' label='Margarin' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput label='Satuan' onChange={(e) => onHandleAddShopping(e, 'MARGARIN')} name='price' value={ingredientsPrice.MARGARIN.price?.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'STRAWBERRY')} name='qty' value={ingredientsPrice.STRAWBERRY?.qty} className='flex-grow-1' label='Strawberry' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput label='Satuan' onChange={(e) => onHandleAddShopping(e, 'STRAWBERRY')} name='price' className='flex-fill' value={ingredientsPrice.STRAWBERRY?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'BLUEBERRY')} name='qty' value={ingredientsPrice.BLUEBERRY?.qty} label='Blueberry' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput label='Satuan' onChange={(e) => onHandleAddShopping(e, 'BLUEBERRY')} name='price' value={ingredientsPrice.BLUEBERRY.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'NANAS')} name='qty' value={ingredientsPrice.NANAS?.qty} label='Nanas' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput label='Satuan' onChange={(e) => onHandleAddShopping(e, 'NANAS')} name='price' value={ingredientsPrice.NANAS?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'TARO')} name='qty' value={ingredientsPrice.TARO?.qty} label='Taro' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput label='Satuan' onChange={(e) => onHandleAddShopping(e, 'TARO')} name='price' value={ingredientsPrice.TARO?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'COKLAT')} name='qty' value={ingredientsPrice.COKLAT?.qty} label='Coklat' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput label='Satuan' onChange={(e) => onHandleAddShopping(e, 'COKLAT')} name='price' value={ingredientsPrice.COKLAT?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'TIRAMISU')} name='qty' value={ingredientsPrice.TIRAMISU?.qty} label='Tiramisu' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput label='Satuan' onChange={(e) => onHandleAddShopping(e, 'TIRAMISU')} name='price' value={ingredientsPrice.TIRAMISU?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'GREENTEA')} name='qty' value={ingredientsPrice.GREENTEA?.qty} label='Greentea' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput label='Satuan' onChange={(e) => onHandleAddShopping(e, 'GREENTEA')} name='price' value={ingredientsPrice.GREENTEA?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'CHOCO_CRUNCHY')} name='qty' value={ingredientsPrice.CHOCO_CRUNCHY?.qty} label='Choco Crunchy' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput label='Satuan' onChange={(e) => onHandleAddShopping(e, 'CHOCO_CRUNCHY')} name='price' value={ingredientsPrice.CHOCO_CRUNCHY?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'KEJU')} name='qty' value={ingredientsPrice.KEJU?.qty} label='Keju' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput label='Satuan' onChange={(e) => onHandleAddShopping(e, 'KEJU')} name='price' value={ingredientsPrice.KEJU?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex mb-3' style={{ gap: '10px' }}>
                    <MDBRadio checked={ingredientsPrice.KACANG.qty == 0.5 ? true : false} onClick={(e) => onHandleAddShopping(e, 'KACANG', 'qty')} value={0.5} name='qty_kacang' label='1/2' />
                    <MDBRadio checked={ingredientsPrice.KACANG.qty == 0.25 ? true : false} onClick={(e) => onHandleAddShopping(e, 'KACANG', 'qty')} value={0.25} name='qty_kacang' label='1/4' />
                  </div>
                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'KACANG')} name='qty' value={ingredientsPrice.KACANG?.qty} label='Kacang' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput label='Satuan' onChange={(e) => onHandleAddShopping(e, 'KACANG')} name='price' value={ingredientsPrice.KACANG?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex mb-3' style={{ gap: '10px' }}>
                    <MDBRadio checked={ingredientsPrice.SUSU_KENTAL.qty == 0.5 ? true : false} value={0.5} onClick={(e) => onHandleAddShopping(e, 'SUSU_KENTAL', 'qty')} name='qty_susukental' label='1/2' />
                    <MDBRadio checked={ingredientsPrice.SUSU_KENTAL.qty == 0.25 ? true : false} value={0.25} onClick={(e) => onHandleAddShopping(e, 'SUSU_KENTAL', 'qty')} name='qty_susukental' label='1/4' />
                  </div>
                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'SUSU_KENTAL')} value={ingredientsPrice.SUSU_KENTAL?.qty} label='Susu Kental Manis' name='qty' placeholder='Satuan per kaleng' type='number' />
                    <span>x</span>
                    <MDBInput label='Satuan' name='price' onChange={(e) => onHandleAddShopping(e, 'SUSU_KENTAL')} value={ingredientsPrice.SUSU_KENTAL?.price.toLocaleString('id')} />
                    <span>/kaleng</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'KARDUS')} name='qty' value={ingredientsPrice.KARDUS?.qty} label='Kardus' placeholder='Satuan per biji' type='number' />
                    <span>x</span>
                    <MDBInput label='Satuan' onChange={(e) => onHandleAddShopping(e, 'KARDUS')} name='price' value={ingredientsPrice.KARDUS?.price.toLocaleString('id')} />
                    <span>/biji</span>
                  </div>

                  <div className='d-flex mb-3' style={{ gap: '10px' }}>
                    <MDBRadio checked={ingredientsPrice.PLASTIK.qty == 0.5 ? true : false} value={0.5} onClick={(e) => onHandleAddShopping(e, 'PLASTIK', 'qty')} name='qty_plastik' label='1/2' />
                    <MDBRadio checked={ingredientsPrice.PLASTIK.qty == 0.25 ? true : false} value={0.25} onClick={(e) => onHandleAddShopping(e, 'PLASTIK', 'qty')} name='qty_plastik' label='1/4' />
                  </div>
                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'PLASTIK')} name='qty' value={ingredientsPrice.PLASTIK?.qty} label='Plastik' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput label='Satuan' value={ingredientsPrice.PLASTIK?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'LPG')} name='qty' value={ingredientsPrice.LPG?.qty} label='LPG' placeholder='Satuan per 3 kg' type='number' />
                    <MDBInput label='Satuan' onChange={(e) => onHandleAddShopping(e, 'LPG')} name='price' value={ingredientsPrice.LPG?.price.toLocaleString('id')} />
                    <span>/biji</span>
                  </div>

                  <MDBBtn className='w-100' color='success' onClick={onHandleResultShopping}>Hitung !</MDBBtn>
                </>
              }
              <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                <MDBModalDialog centered>
                  <MDBModalContent>
                    <MDBModalHeader>
                      <MDBModalTitle>Pembelanjaan Hari Ini</MDBModalTitle>
                      <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody style={{maxHeight: '400px', overflowY: 'auto'}}>
                      {
                        allShopping.length != 0 ?
                          allShopping.map((v, id) => {
                            return (
                              <div key={id} className='d-flex justify-content-between align-items-end mb-2'>
                                <div>
                                  - {toSentenceCase(v.name.replace('_', ' '))} {v.qty} <br />
                                  @ Rp. {v.totalPerItem.toLocaleString('ID')}
                                </div>
                                <MDBBtn onClick={() => onHandleDeleteItem(id)} color='danger' size='sm'>Hapus</MDBBtn>
                              </div>
                            )
                          })
                          :
                          <>Belum ada data</>
                      }
                      <p hidden={allShopping.length != 0 ? false : true}><b>Total</b> : Rp. {allShopping.length != 0 && allShopping.map(v => { return v.totalPerItem }).reduce((x, y) => x + y).toLocaleString('ID')}</p>
                    </MDBModalBody>
                    <MDBModalFooter>
                      <MDBBtn disabled={allShopping.length == 0 ? true : false} color='success' onClick={onHandlePrintShopping}>Kirim Data</MDBBtn>
                    </MDBModalFooter>
                  </MDBModalContent>
                </MDBModalDialog>
              </MDBModal>
            </MDBContainer>
            :
            // ***2PENJUALAN*** //
            <MDBContainer className="d-flex justify-content-start flex-wrap mx-0">
              <div className='break'></div>
              <div className='mt-5'>
                <p>Ukuran Roti</p>
                <MDBRadio checked={breadSize == 'small' ? true : false} onClick={() => setbreadSize('small')} name='bread' value='small' id='flexCheckDefault' label='Kecil' />
                <MDBRadio checked={breadSize == 'big' ? true : false} onClick={() => setbreadSize('big')} name='bread' value='big' label='Besar' />
              </div>
              <div className='break'></div>
              <div>
                <br />
                <p>Rasa</p>
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.STRAWBERRY.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.STRAWBERRY)} label='Strawberry' />
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.BLUEBERRY.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.BLUEBERRY)} label='Blueberry' />
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.NANAS.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.NANAS)} label='Nanas' />
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.TARO.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.TARO)} label='Taro' />
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.COKLAT.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.COKLAT)} label='Coklat' />
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.TIRAMISU.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.TIRAMISU)} label='Tiramisu' />
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.KEJU.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.KEJU)} label='Keju' />
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.GREEN_TEA.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.GREEN_TEA)} label='Green Tea' />
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.CHOCO_CRUNCHY.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.CHOCO_CRUNCHY)} label='Choco Crunchy' />
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.COKLAT_KEJU.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.COKLAT_KEJU)} label='Coklat Keju' />
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.COKLAT_KACANG.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.COKLAT_KACANG)} label='Coklat Kacang' />
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.POLOS.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.POLOS)} label='Polos' />
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.POLOS_BAKAR.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.POLOS_BAKAR)} label='Polos Bakar' />
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.ASIN_ORI.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.ASIN_ORI)} label='Asin Original' />
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.ASIN_ABON.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.ASIN_ABON)} label='Asin Abon' />
                <MDBRadio disabled={breadSize == '' ? true : false} checked={order.flavour == FLAVOUR_PRICE.ASIN_PEDAS.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.ASIN_PEDAS)} label='Asin Extra Pedas' />
              </div>
              <div className='break'></div>
              <div>
                <br />
                <p>Jumlah pesanan</p>
                <MDBInput label='Jumlah' placeholder='1' type='number' value={order.quantity} onChange={onChangeQuantityOrder} />
              </div>
              <div className='break'></div>
              {/* <div className='w-50'>
                <br />
                <p>Lainnya</p>
                <MDBInput label='Nama Varian' placeholder='Roti kecil + Cokelat + Tiramisu' />
                <br />
                <MDBInput label='Harga' placeholder='25000' type='number' />
              </div> */}
              <div className='break'></div>
              <br />
              <div className='d-flex justify-content-between' style={{ gap: '10px' }}>
                <MDBBtn color='success' onClick={onHandleSaveOrder}>Tambah ke data harian</MDBBtn>
                <MDBBtn color='warning' onClick={() => {
                  if (savedPhoneNumber == null || savedPhoneNumber == '') {
                    Swal.fire({
                      title: 'Data tidak bisa diproses',
                      text: 'Anda belum mengisi nomor handphone',
                      icon: 'warning'
                    })
                  } else {
                    toggleShow2()
                  }
                }}>Cek data harian &amp; kirim nota</MDBBtn>
              </div>
              <div className='mt-4 w-100'>
                <MDBBtn
                  color='danger'
                  className='w-100'
                  onClick={() => {
                    Swal.fire({
                      title: 'Hapus data',
                      text: 'Anda yakin akan hapus seluruh data pembelian di hari ini ?',
                      icon: 'warning',
                      cancelButtonText: 'Tutup',
                      showCancelButton: true
                    }).then(res => {
                      if (res.isConfirmed) {
                        dispatch(saveDailyData([]))
                      }
                    })
                  }}>
                  Reset data paksa
                </MDBBtn>
              </div>
              <MDBModal show={basicModal2} setShow={setBasicModal2} tabIndex='-1'>
                <MDBModalDialog centered>
                  <MDBModalContent>
                    <MDBModalHeader>
                      <MDBModalTitle>Penjualan Hari Ini</MDBModalTitle>
                      <MDBBtn className='btn-close' color='none' onClick={toggleShow2}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody style={{maxHeight: '400px', overflowY: 'auto'}}>
                      {
                        orderList.length != 0 ?
                          orderList.map((v, id) => {
                            return (
                              <div key={id} className='d-flex justify-content-between align-items-end mb-2'>
                                <div>
                                  {v.quantity} {v.orderName} : <br />
                                  Rp. {v.amount?.toLocaleString('ID')}
                                </div>
                                <MDBBtn onClick={() => onHandleDeleteOrder(id)} color='danger' size='sm'>Hapus</MDBBtn>
                              </div>
                            )
                          })
                          :
                          <>Belum ada data</>
                      }
                      <p hidden={orderList.length != 0 ? false : true}><b>Total</b> = Rp. {orderList.length != 0 && orderList.map(v => { return v.amount }).reduce((x, y) => x + y)?.toLocaleString('ID')}</p>
                    </MDBModalBody>
                    <MDBModalFooter>
                      <MDBBtn disabled={orderList.length == 0 ? true : false} color='success' onClick={onHandlePrintOrder}>Kirim Data</MDBBtn>
                    </MDBModalFooter>
                  </MDBModalContent>
                </MDBModalDialog>
              </MDBModal>
            </MDBContainer>
        }
      </MDBContainer>
    </Fragment>
  );
}

export default App;
