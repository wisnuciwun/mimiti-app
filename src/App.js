import logo from './logo.svg';
import './App.css';
import { MDBBtn, MDBCheckbox, MDBContainer, MDBInput, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBRadio } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { BREAD_PRICE, FLAVOUR_PRICE, INGREDIENTS } from './constants/Constants';
import { Fragment, useEffect, useState } from 'react';
import { saveDailyData } from './config/redux/actions/mainAction';
import toSentenceCase from './utlis/toSentenceCase';

function App(props) {
  const dispatch = useDispatch()
  const orderList = useSelector(state => state.main.orderListData)
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

  const onHandleSetOrder = (e) => {
    // console.log("zzz", e.target.name, JSON.parse(e.target.value))
    let values = JSON.parse(e.target.value)
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

    window.open(`https://api.whatsapp.com/send?phone=6285608050707&text=${w}%0A%0A•%20Penjualan%0A${v}%0A%0ATotal%20=%20Rp.%20${totalAmount.toLocaleString('ID')}`, '_blank')
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

    window.open(`https://api.whatsapp.com/send?phone=6285608050707&text=${w}%0A%0A•%20Pembelanjaan%0A${v}%0A%0ATotal%20=%20Rp.%20${totalAmount.toLocaleString('ID')}`, '_blank')
    setTimeout(() => {
      window.location.reload()
    }, 200);
  }

  const onHandleAddShopping = (e, category, name) => {
    let names = e.target.name.includes('_') ? name : e.target.name
    setingredientsPrice({
      ...ingredientsPrice,
      [category]: {
        ...ingredientsPrice[category],
        [names]: e.target.value.includes('.') ? parseFloat(e.target.value) : (parseInt(e.target.value))
      }
    })
  }

  const onHandleResultShopping = () => {
    let allShoppingItem = []
    Object.entries(ingredientsPrice).map((x, y) => {
      if (x[1].qty != 0) {
        allShoppingItem.push({ pricePerItem: x[1].price, qty: x[1].qty, name: x[0], totalPerItem: x[1].price * x[1].qty })
      }
    })

    setallShopping(allShoppingItem)
    toggleShow()
    console.log("msk", allShoppingItem)
  }

  const onHandleDeleteItem = (id) => {
    console.log("mskdel");
    allShopping.splice(id, 1)
    setTimeout(() => {
      setallShopping(allShopping)
    }, 200);
  }

  console.log("mskluar", orderList)
  // *** //

  const [ingredientsPrice, setingredientsPrice] = useState({ ...INGREDIENTS })

  return (
    <Fragment>
      <MDBContainer className='pt-5 pb-5'>
        <div className='d-flex justify-content-between align-items-center'>
          <h2>{view == 'SHOP' ? 'Halaman Pembelanjaan' : 'Halaman Penjualan'}</h2>
          <div>
            <MDBBtn size='sm' onClick={() => setview('SHOP')} hidden={view == 'SHOP' ? true : false}>Pindah Halaman Penjualan</MDBBtn>
            <MDBBtn size='sm' onClick={() => setview('SELL')} hidden={view == 'SELL' ? true : false}>Pindah Halaman Pembelanjaan</MDBBtn>
          </div>
        </div>
        {
          view == 'SHOP' ?
            <MDBContainer style={{ padding: '50px' }} className='w-50 mx-0'>
              {
                ingredientsPrice != null &&
                // ***1PEMBELANJAAN*** //
                <>
                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBRadio checked={ingredientsPrice.MARGARIN.qty == 0.5 ? true : false} value={0.5} onClick={(e) => onHandleAddShopping(e, 'MARGARIN', 'qty')} name='qty_margarin' label='1/2' />
                    <MDBRadio checked={ingredientsPrice.MARGARIN.qty == 0.25 ? true : false} value={0.25} onClick={(e) => onHandleAddShopping(e, 'MARGARIN', 'qty')} name='qty_margarin' label='1/4' />
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'MARGARIN')} name='qty' value={ingredientsPrice.MARGARIN.qty} className='flex-fill' label='Margarin' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'MARGARIN')} name='price' value={ingredientsPrice.MARGARIN.price?.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'STRAWBERRY')} name='qty' value={ingredientsPrice.STRAWBERRY?.qty} className='flex-grow-1' label='Strawberry' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'STRAWBERRY')} name='price' className='flex-fill' value={ingredientsPrice.STRAWBERRY?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'BLUEBERRY')} name='qty' value={ingredientsPrice.BLUEBERRY?.qty} label='Blueberry' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'BLUEBERRY')} name='price' value={ingredientsPrice.BLUEBERRY.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'NANAS')} name='qty' value={ingredientsPrice.NANAS?.qty} label='Nanas' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'NANAS')} name='price' value={ingredientsPrice.NANAS?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'TARO')} name='qty' value={ingredientsPrice.TARO?.qty} label='Taro' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'TARO')} name='price' value={ingredientsPrice.TARO?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'COKLAT')} name='qty' value={ingredientsPrice.COKLAT?.qty} label='Coklat' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'COKLAT')} name='price' value={ingredientsPrice.COKLAT?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'TIRAMISU')} name='qty' value={ingredientsPrice.TIRAMISU?.qty} label='Tiramisu' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'TIRAMISU')} name='price' value={ingredientsPrice.TIRAMISU?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'GREENTEA')} name='qty' value={ingredientsPrice.GREENTEA?.qty} label='Greentea' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'GREENTEA')} name='price' value={ingredientsPrice.GREENTEA?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'CHOCO_CRUNCHY')} name='qty' value={ingredientsPrice.CHOCO_CRUNCHY?.qty} label='Choco Crunchy' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'CHOCO_CRUNCHY')} name='price' value={ingredientsPrice.CHOCO_CRUNCHY?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'KEJU')} name='qty' value={ingredientsPrice.KEJU?.qty} label='Keju' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'KEJU')} name='price' value={ingredientsPrice.KEJU?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBRadio checked={ingredientsPrice.KACANG.qty == 0.5 ? true : false} onClick={(e) => onHandleAddShopping(e, 'KACANG', 'qty')} value={0.5} name='qty_kacang' label='1/2' />
                    <MDBRadio checked={ingredientsPrice.KACANG.qty == 0.25 ? true : false} onClick={(e) => onHandleAddShopping(e, 'KACANG', 'qty')} value={0.25} name='qty_kacang' label='1/4' />
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'KACANG')} name='qty' value={ingredientsPrice.KACANG?.qty} label='Kacang' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'KACANG')} name='price' value={ingredientsPrice.KACANG?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBRadio checked={ingredientsPrice.SUSU_KENTAL.qty == 0.5 ? true : false} value={0.5} onClick={(e) => onHandleAddShopping(e, 'SUSU_KENTAL', 'qty')} name='qty_susukental' label='1/2' />
                    <MDBRadio checked={ingredientsPrice.SUSU_KENTAL.qty == 0.25 ? true : false} value={0.25} onClick={(e) => onHandleAddShopping(e, 'SUSU_KENTAL', 'qty')} name='qty_susukental' label='1/4' />
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'SUSU_KENTAL')} value={ingredientsPrice.SUSU_KENTAL?.qty} label='Susu Kental Manis' name='qty' placeholder='Satuan per kaleng' type='number' />
                    <span>x</span>
                    <MDBInput name='price' onChange={(e) => onHandleAddShopping(e, 'SUSU_KENTAL')} value={ingredientsPrice.SUSU_KENTAL?.price.toLocaleString('id')} />
                    <span>/kaleng</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'KARDUS')} name='qty' value={ingredientsPrice.KARDUS?.qty} label='Kardus' placeholder='Satuan per biji' type='number' />
                    <span>x</span>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'KARDUS')} name='price' value={ingredientsPrice.KARDUS?.price.toLocaleString('id')} />
                    <span>/biji</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBRadio checked={ingredientsPrice.PLASTIK.qty == 0.5 ? true : false} value={0.5} onClick={(e) => onHandleAddShopping(e, 'PLASTIK', 'qty')} name='qty_plastik' label='1/2' />
                    <MDBRadio checked={ingredientsPrice.PLASTIK.qty == 0.25 ? true : false} value={0.25} onClick={(e) => onHandleAddShopping(e, 'PLASTIK', 'qty')} name='qty_plastik' label='1/4' />
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'PLASTIK')} name='qty' value={ingredientsPrice.PLASTIK?.qty} label='Plastik' placeholder='Satuan per kg' type='number' />
                    <span>x</span>
                    <MDBInput value={ingredientsPrice.PLASTIK?.price.toLocaleString('id')} />
                    <span>/kg</span>
                  </div>

                  <div className='d-flex align-items-center' style={{ height: '32px', marginBottom: '30px', gap: '20px' }}>
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'LPG')} name='qty' value={ingredientsPrice.LPG?.qty} label='LPG' placeholder='Satuan per 3 kg' type='number' />
                    <MDBInput onChange={(e) => onHandleAddShopping(e, 'LPG')} name='price' value={ingredientsPrice.LPG?.price.toLocaleString('id')} />
                    <span>/biji</span>
                  </div>

                  <MDBBtn onClick={onHandleResultShopping}>Hitung !</MDBBtn>
                </>
              }
              <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                <MDBModalDialog centered>
                  <MDBModalContent>
                    <MDBModalHeader>
                      <MDBModalTitle>Pembelanjaan Hari Ini</MDBModalTitle>
                      <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                      {
                        allShopping.length != 0 ?
                          allShopping.map((v, id) => {
                            return (
                              <div key={id} className='d-flex justify-content-between align-items-center mb-2'>
                                <span>- {toSentenceCase(v.name.replace('_', ' '))} {v.qty} @ Rp. {v.totalPerItem.toLocaleString('ID')}</span>
                                <MDBBtn disabled onClick={() => onHandleDeleteItem(id)} color='danger' size='sm'>Hapus</MDBBtn>
                              </div>
                            )
                          })
                          :
                          <>Belum ada data</>
                      }
                      <p hidden={allShopping.length != 0 ? false : true}>Total : Rp. {allShopping.length != 0 && allShopping.map(v => { return v.totalPerItem }).reduce((x, y) => x + y).toLocaleString('ID')}</p>
                    </MDBModalBody>

                    <MDBModalFooter>
                      <MDBBtn color='secondary' onClick={toggleShow}>
                        Tutup
                      </MDBBtn>
                      <MDBBtn onClick={onHandlePrintShopping}>Kirim Data</MDBBtn>
                    </MDBModalFooter>
                  </MDBModalContent>
                </MDBModalDialog>
              </MDBModal>
            </MDBContainer>
            :
            // ***2PENJUALAN*** //
            <MDBContainer className="d-flex justify-content-start flex-wrap mx-0">
              <div className='break'></div>
              <div className='w-25 mt-5'>
                <p>Ukuran Roti</p>
                <MDBRadio checked={breadSize == 'small' ? true : false} onClick={() => setbreadSize('small')} name='bread' value='small' id='flexCheckDefault' label='Kecil' />
                <MDBRadio checked={breadSize == 'big' ? true : false} onClick={() => setbreadSize('big')} name='bread' value='big' label='Besar' />
              </div>
              <div className='break'></div>
              <div className='w-25'>
                <br />
                <p>Rasa</p>
                <MDBRadio checked={order.flavour == FLAVOUR_PRICE.STRAWBERRY.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.STRAWBERRY)} label='Strawberry' />
                <MDBRadio checked={order.flavour == FLAVOUR_PRICE.BLUEBERRY.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.BLUEBERRY)} label='Blueberry' />
                <MDBRadio checked={order.flavour == FLAVOUR_PRICE.NANAS.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.NANAS)} label='Nanas' />
                <MDBRadio checked={order.flavour == FLAVOUR_PRICE.TARO.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.TARO)} label='Taro' />
                <MDBRadio checked={order.flavour == FLAVOUR_PRICE.COKLAT.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.COKLAT)} label='Coklat' />
                <MDBRadio checked={order.flavour == FLAVOUR_PRICE.TIRAMISU.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.TIRAMISU)} label='Tiramisu' />
                <MDBRadio checked={order.flavour == FLAVOUR_PRICE.KEJU.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.KEJU)} label='Keju' />
                <MDBRadio checked={order.flavour == FLAVOUR_PRICE.GREEN_TEA.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.GREEN_TEA)} label='Green Tea' />
                <MDBRadio checked={order.flavour == FLAVOUR_PRICE.CHOCO_CRUNCHY.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.CHOCO_CRUNCHY)} label='Choco Crunchy' />
                <MDBRadio checked={order.flavour == FLAVOUR_PRICE.COKLAT_KEJU.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.COKLAT_KEJU)} label='Coklat Keju' />
                <MDBRadio checked={order.flavour == FLAVOUR_PRICE.COKLAT_KACANG.name ? true : false} onClick={onHandleSetOrder} name='flavour' value={JSON.stringify(FLAVOUR_PRICE.COKLAT_KACANG)} label='Coklat Kacang' />
              </div>
              <div className='break'></div>
              <div className='w-25'>
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
                <MDBBtn color='warning' onClick={toggleShow2}>Cek data harian &amp; kirim nota</MDBBtn>
              </div>
              <MDBModal show={basicModal2} setShow={setBasicModal2} tabIndex='-1'>
                <MDBModalDialog centered>
                  <MDBModalContent>
                    <MDBModalHeader>
                      <MDBModalTitle>Penjualan Hari Ini</MDBModalTitle>
                      <MDBBtn className='btn-close' color='none' onClick={toggleShow2}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                      {
                        orderList.length != 0 ?
                          orderList.map((v, id) => {
                            return (
                              <div key={id} className='d-flex justify-content-between align-items-center mb-2'>
                                <span>{v.quantity} {v.orderName} : Rp. {v.amount.toLocaleString('ID')}</span>
                                <MDBBtn disabled color='danger' size='sm'>Hapus</MDBBtn>
                              </div>
                            )
                          })
                          :
                          <>Belum ada data</>
                      }
                      <p hidden={orderList.length != 0 ? false : true}>Total = Rp. {orderList.length != 0 && orderList.map(v => { return v.amount }).reduce((x, y) => x + y).toLocaleString('ID')}</p>
                    </MDBModalBody>

                    <MDBModalFooter>
                      <MDBBtn color='secondary' onClick={toggleShow2}>
                        Tutup
                      </MDBBtn>
                      <MDBBtn onClick={onHandlePrintOrder}>Kirim Data</MDBBtn>
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
