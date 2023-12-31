import React from "react";
// import HeaderAdmin from '../Component/Header/HeaderAdmin'
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import NavbarAdmin from '../Component/NavbarAdmin';
import NavbarKasir from '../Component/NavbarKasir';
import NavbarManajer from '../Component/NavbarManajer';

export default class Transaksi extends React.Component {
  constructor() {
    super();
    this.state = {
      token: "",
      transaksi: [],
      menu: [],
      selectTransaction: [],
      isModalOpen: false,
      id_transaksi: "",
      id_user: "",
      nama_user: "",
      kode_invoice: "",
      id_meja: "",
      nomor_meja: "",
      dibayar: "",
      status: "",
      nama_pelanggan: "",
      tgl_transaksi: "",
      detail_transaksi: [],
      time: "",
      total: 0,
    };
    if (localStorage.getItem("token")) {
      //pengecekan ada token apa tidak
      //token dibutuhkan setiap saat mau ngakses API, token diambil dari local storage, data login disimpan ke local storage
      this.state.token = localStorage.getItem("token");
      this.state.id_user = localStorage.getItem("id_user");
      this.state.nama_pelanggan = localStorage.getItem("nama_pelanggan");
      this.state.id_meja = localStorage.getItem("meja");
      this.state.id_menu = localStorage.getItem("menu");
      this.state.role = localStorage.getItem("role");
    } else {
      window.location = "/login";
    }
  }

  details = (item) => {
    let date = new Date(item.waktu);
    let tm = `${date.getDate()}/${
      Number(date.getMonth()) + 1
    }/${date.getFullYear()}`;
    this.setState({
      selectTransaction: item.detail_transaksi,
      isModalOpen: true,
      id_transaksi: item.id_transaksi,
      kode_invoice: item.kode_invoice,
      nama_pelanggan: item.nama_pelanggan,
      id_meja: item.meja.id_meja,
      nomor_meja_meja: item.meja.nomor_meja,
      id_menu: item.menu.id_menu,
      nama_menu: item.menu.nama_menu,
      time: tm,
    });
  };

  convertTime = (time) => {
    let date = new Date(time);
    return `${date.getDate()}/${
      Number(date.getMonth()) + 1
    }/${date.getFullYear()}`;
  };

  headerConfig = () => {
    let header = {
      headers: { Authorization: `Bearer ${this.state.token}` },
    };
    return header;
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleClose = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  handleEdit = (item) => {
    this.setState({
      id_transaksi: item.id_transaksi,
      dibayar: item.dibayar,
      status: item.status,
      kode_invoice: item.kode_invoice,
      nama_user: item.user.nama_user,
      nama_pelanggan: item.nama_pelanggan,
      tgl_transaksi: item.tgl_transaksi,
      action: "update",
      detail_transaksi: item.detail_transaksi,
      total: item.total,
      isModalOpen: true,
    });
  };

  // handleSave = e => {
  //     e.preventDefault()
  //     let form = []
  //         if(this.state.tgl_bayar != null){
  //             form ={
  //                 status: this.state.status
  //             }
  //         }else{
  //             form ={
  //                 status: this.state.status,
  //                 dibayar: this.state.dibayar
  //             }
  //         }
  //     }

  handleSave = (e) => {
    e.preventDefault();
    let bayar = "";
    if (this.state.status === "diambil") {
      bayar = "dibayar";
    } else {
      bayar = "belum_bayar";
    }
    let form = {
      id_transaksi: this.state.id_transaksi,
      nama_pelanggan: this.state.nama_pelanggan,
      status: this.state.status,
      dibayar: bayar,
      //nama_pelanggan : localStorage.getItem("nama_pelanggan")
    };
    let url = "";
    if (this.state.action === "insert") {
      url = "http://localhost:8080/transaksi/" + this.state.id_transaksi;
      axios
        .post(url, form)
        .then((res) => {
          this.getTransaction();
          this.handleClose();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      url = "http://localhost:8080/transaksi/" + this.state.id_transaksi;
      axios
        .put(url, form)
        .then((res) => {
          this.getTransaction();
          this.handleClose();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  getTransaction = () => {
    let url =
      "http://localhost:8080/transaksi/byUser/" + this.state.id_user;

    axios
      .get(url)

      .then((res) => {
        this.setState({
          transaksi: res.data,
          // member: res.data.transaksi.member
          // custCount: res.data.count
        });
        console.log(this.state.transaksi);
        console.log(url);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  detail = (id) => {
    localStorage.setItem("id_transaksi", id);
    window.location = "/DetailTransaksi";
  };

  dropTran = (id_transaksi) => {
    if (window.confirm("are you sure will delete this item?")) {
      let url = "http://localhost:8080/transaksi/" + id_transaksi;
      axios
        .delete(url, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          this.getTransaction();
        })
        .catch((error) => console.log(error));
    }
  };

  searching = (event) => {
    if (event.keyCode === 13) {
      // 13 adalah kode untuk tombol enter
      let keyword = this.state.keyword.toLowerCase();
      let tempTransaksi = this.state.transaksi;
      let result = tempTransaksi.filter((item) => {
        return item.kode_invoice.toLowerCase().includes(keyword); 
      });
      this.setState({ transaksi: result });
    }
  };

  componentDidMount() {
    this.getTransaction();
  }

  render() {
    return (
      <>
        <div>
        {this.state.role == "admin" &&
                            <NavbarAdmin />
                        }
                {this.state.role == "kasir" &&
                            <NavbarKasir />
                        }
                {this.state.role == "manajer" &&
                    <NavbarManajer />
                }
        <div className="container">  
        <div class="card mt-3">
            <div class="card-header" style={{ backgroundColor: '#FAF3F0'}} >
            <div className='alert text-black' style={{ backgroundColor: '#FEBBCC'}} >
                        <h2 class="text-center"><b>Data Transaksi</b></h2>
	        </div>
          <div className="container">
            <input type="text"className="form-control my-2" placeholder="Pencarian Berdasarkan Kode Invoice" value={this.state.keyword} onChange={ev => this.setState({ keyword: ev.target.value })} onKeyUp={ev => this.searching(ev)} />
            {/* <div className="row mt-4">
                        <div className="col">
                            <form className="form-inline">
                                <input type="date" name="tgl" className="form-control"/>
                                <input type="date" name="tgl" className="form-control ml-3"/>
                                    <button type="submit" name="filter_tgl" className="btn btn-info ml-3"></button>
                            </form>
                        </div>
                    </div> */}
            <table className="table table-bordered table-striped table-hover">
              <thead>
                <tr align="center">
                  <th>No</th>
                  <th>Kode Invoice</th>
                  <th>Nama User</th>
                  <th>Nama Pelanggan</th>
                  <th>Nomor Meja</th>
                  <th>Tanggal Transaksi</th>
                  <th>Payment Status</th>
                  <th>Status Order</th>
                  <th>Total</th>
                  <th>Option</th>
                </tr>
              </thead>
              <tbody align="center">
                {this.state.transaksi.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.kode_invoice}</td>
                      <td>{item.user.nama_user}</td>
                      <td>{item.nama_pelanggan}</td>
                      <td>{item.meja.nomor_meja}</td>
                      <td>{this.convertTime(item.tgl_transaksi)}</td>
                      <td>{item.dibayar}</td>
                      <td>{item.status}</td>
                      <td>{item.total}</td>
                      <td>
                        {item.dibayar === "dibayar" ? (
                          <button
                            className="btn btn-sm m-1" style={{ color: '#A084E8'}}
                            onClick={() => this.handleEdit(item)}
                            disabled
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              class="bi bi-pencil-square"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fill-rule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                              />
                            </svg>
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm m-1" style={{ color: '#A084E8'}}
                            onClick={() => this.handleEdit(item)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              class="bi bi-pencil-square"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fill-rule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                              />
                            </svg>
                          </button>
                        )}
                        {/* button untuk mengedit */}
                        {/* <button className="btn btn-sm btn-primary m-1"  onClick={() => this.handleEdit(item)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                            </svg>
                                            </button> */}
                        {/* button untuk menghapus */}
                        <button
                          className="btn btn-sm m-1" style={{ color: '#EA1179'}}
                          onClick={() => this.dropTran(item.id_transaksi)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            class="bi bi-trash"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                            <path
                              fill-rule="evenodd"
                              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                            />
                          </svg>
                        </button>
                        <Button
                          style={{ backgroundColor: '#D8B4F8'}}
                          href="/Detail"
                          onClick={() => this.detail(item.id_transaksi)}
                        >
                          Detail
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* modal admin  */}
            <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Transaction</Modal.Title>
              </Modal.Header>
              <Form onSubmit={(e) => this.handleSave(e)}>
                <Modal.Body>
                  <Form.Group
                    className="mb-3 text-dark bg-transparent"
                    controlId="nama"
                  >
                    <Form.Label className="text-black">
                      Invoice Code{" "}
                    </Form.Label>
                    <Form.Control
                      className="text-dark bg-transparent"
                      type="text"
                      name="kode_invoice"
                      disabled
                      value={this.state.kode_invoice}
                      required
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3 text-dark bg-transparent"
                    controlId="nama"
                  >
                    <Form.Label className="text-black">
                      Transaction Date{" "}
                    </Form.Label>
                    <Form.Control
                      className="text-dark bg-transparent"
                      type="text"
                      name="tgl_transaksi"
                      disabled
                      value={this.convertTime(this.state.tgl_transaksi)}
                      required
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3 text-dark bg-transparent"
                    controlId="nama"
                  >
                    <Form.Label className="text-black">User Name </Form.Label>
                    <Form.Control
                      className="text-dark bg-transparent"
                      type="text"
                      name="nama_user"
                      disabled
                      value={this.state.nama_user}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label> Status Order </Form.Label>
                    <Form.Select
                      id="mySelect"
                      value={this.state.status}
                      onChange={(ev) =>
                        this.setState({ status: ev.target.value })
                      }
                    >
                      <option className="firstOption" value="" hidden={true}>
                        Pilih Status
                      </option>
                      <option value="selesai">Selesai</option>
                      <option value="diambil">Diambil</option>
                    </Form.Select>
                  </Form.Group>
                  {/* <Form.Label> Status Pembayaran </Form.Label>
                            <Form.Select id="mySelect" value={this.state.dibayar} onChange={(ev) => this.setState({ dibayar: ev.target.value })}>
                                <option className="firstOption" value="" hidden={true}>
                                    Pilih Status Pembayaran
                                </option>
                                <option value="dibayar">dibayar</option>
                                <option value="belum dibayar">belum dibayar</option>

                                {this.state.dibayar === "dibayar" &&
                                <Form.Select type="text" name="dibayar" id="mySelect" value={this.state.dibayar} onChange={(ev) => this.setState({ dibayar: ev.target.value })}>
                                     <option value="dibayar">dibayar</option>
                                </Form.Select>
                                }
                            </Form.Select> */}
                  <br></br>
                  <div className="card col-12 mt-2">
                    <div className="card-header text-black" style={{ backgroundColor: '#FEBBCC'}}>
                      <h4>Detail Transaksi</h4>
                    </div>
                    <div className="card-body">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Menu</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.detail_transaksi.map((item, index) => (
                            <tr key={index}>
                              <td>{item.menu.nama_menu}</td>
                              <td>Rp {item.menu.harga}</td>
                              <td>{item.qty}</td>
                              <td className="text-right">
                                Rp {item.menu.harga * item.qty}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan="3">Total</td>
                            <td className="text-right">
                              Rp {this.state.total}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={this.handleClose}
                  >
                    Save
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
          </div>
        </div>
        </div>
        </div>
        </div>
      </>
    );
  }
}