import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Form } from "antd";
import "antd/dist/antd.css";
import "./Admin.css";
import axios from "axios";
// This is for the pdf file
import jsPDF from "jspdf";
// This is the routing for the app
import {useNavigate} from "react-router-dom";

const { Item } = Form;
const baseUrl = 'http://localhost:8000/api/'
const layout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
};



function Admin() {

    const navigate = useNavigate();
    const navigateToHome = () => {
        navigate('/');
    }

    const [data, setData] = useState([]);
    const [modalInsert, setModalInsert] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [Usuario, setUsuario] = useState({
        id:'',
        title: '',
        username: '',
        notes: '',
        created_at: '',
    })

    const openCloseModalInsert = () => {
        setModalInsert(!modalInsert);
    }

    const openCloseModalEdit = () => {
        setModalEdit(!modalEdit);
    }

    const openCloseModalDelete = () => {
        setModalDelete(!modalDelete);
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setUsuario({
            ...Usuario,
            [name]: value
        });
        console.log(Usuario);
    }

    function refreshPage() {
        window.location.reload(false);
    }

    const selectUser = (user, user_case) => {
        setUsuario(user);
        (user_case === "Edit") ? openCloseModalEdit() : openCloseModalDelete()
    }


    const columns = [
        {
            key: "id",
            title: "ID",
            dataIndex: "id",
        },
        {
            key: "title",
            title: "Title of the exam",
            dataIndex: "title",
        },
        {
            key: "username",
            title: "Document of User",
            dataIndex: "username",
        },
        {
            key: "notes",
            title: "Notes of exam prescription",
            dataIndex: "notes",
        },
        {
            key: "created_at",
            title: "Date of exam creation",
            dataIndex: "created_at",
        },
        {
            title: "Actions",
            key: "actions",
            render: (fila) => (
                <>
                    <Button type="primary" onClick={() => selectUser(fila, "Edit")}>Edit</Button> {"   "}
                    <Button type="primary" danger onClick={() => selectUser(fila, "Delete")}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    // REQUEST METHODS ----------------------------------------------------
    const requestGet = async () => {
        await axios.get(baseUrl)
            .then(response => {
                setData(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    const requestPost = async () => {
        delete Usuario.id;
        await axios.post(baseUrl, Usuario)
            .then(response => {
                setData(data.concat(response.data));
                openCloseModalInsert();
            }).catch(error => {
                console.log(error);
            })
    }

    const requestDownloadPDF = async () => {
        await axios.get(baseUrl + Usuario.id+'/', Usuario)
            .then(response => {
                console.log("ESTA ES LA DATAAAAAAAAAAAAAAAAAA",response.data);
                const doc = new jsPDF();
                setData(response.data);
                doc.text(20, 20, "ID: " + response.data.id);
                doc.text(20, 30, "Title: " + response.data.title);
                doc.text(20, 40, "Username: " + response.data.username);
                doc.text(20, 50, "Notes: " + response.data.notes);
                doc.text(20, 60, "Created at: " + response.data.created_at);
                doc.save(response.data.username+".pdf");
                refreshPage()
            }).catch(error => {
                console.log(error);
            })
    }

    const requestPut = async () => {
        await axios.put(baseUrl + Usuario.id+'/', Usuario)
            .then(response => {
                var dataAuxiliar = data;
                dataAuxiliar.map(elemento => {
                    if (elemento.id === Usuario.id) {
                        elemento.title = Usuario.title;
                        elemento.username = Usuario.username;
                        elemento.notes = Usuario.notes;
                        elemento.created_at = Usuario.created_at;
                    }
                });
                setData(dataAuxiliar);
                openCloseModalEdit();
                refreshPage()
            }).catch(error => {
                console.log(error);
            })
    }


    const requestDelete = async () => {
        await axios.delete(baseUrl  +Usuario.id+'/')
            .then(response => {
                setData(data.filter(elemento => elemento.id !== Usuario.id));
                openCloseModalDelete();
            }).catch(error => {
                console.log(error);
            })
    }
    //-------------------------------------------------------------------
    //To call the Get request method
    useEffect(() => {
        requestGet();
    }, [])

    return (
        <div className="App">
            <br />
            <button type="primary" style={{ color: "white", backgroundColor: "#282c34" }}
                    onClick={navigateToHome}><strong> CLICK TO GO BACK</strong></button>
            <br/>
            <br />
            <Button type="primary" className="botonInsertar" onClick={openCloseModalInsert}>Insertar Nuevo Usuario</Button>
            <br />
            <br />
            <Table columns={columns} dataSource={data} />

            <Modal
                visible={modalInsert}
                title="Insertar Usuario"
                destroyOnClose={true}
                onCancel={openCloseModalInsert}
                centered
                footer={[
                    <Button onClick={openCloseModalInsert}>Cancel</Button>,
                    <Button type="primary" onClick={requestPost}>Insert</Button>,
                ]}
            >
                <Form {...layout}>
                    <Form.Item label="Title of the exam">
                        <Input name="title" onChange={handleChange}  />
                    </Form.Item>
                    <Form.Item label="Document of User">
                        <Input name="username" onChange={handleChange}  />
                    </Form.Item>
                    <Form.Item label="Notes of exam prescription">
                        <Input name="notes" onChange={handleChange}  />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                visible={modalEdit}
                title="Editar Usuario"
                onCancel={openCloseModalEdit}
                centered
                footer={[
                    <Button onClick={openCloseModalEdit}>Cancelar</Button>,
                    <Button type="primary" onClick={requestPut}>Editar</Button>,
                    <Button type="primary" style={{ color: "whitesmoke", backgroundColor: "#f40f02" }} onClick={requestDownloadPDF}><strong>
                        Download PDF
                    </strong> </Button>,
                ]}
            >
                <Form {...layout}>
                    <Form.Item label="Title of the exam">
                        <Input name="title" onChange={handleChange} value={Usuario && Usuario.title} />
                    </Form.Item>
                    <Form.Item label="Document of User">
                        <Input name="username" onChange={handleChange} value={Usuario && Usuario.username} />
                    </Form.Item>
                    <Form.Item label="Notes of exam prescription">
                        <Input name="notes" onChange={handleChange} value={Usuario && Usuario.notes} />
                    </Form.Item>
                    <Form.Item label="Date of exam creation">
                        <Input name="created_at" onChange={handleChange} value={Usuario && Usuario.created_at} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                visible={modalDelete}
                onCancel={openCloseModalDelete}
                centered
                footer={[
                    <Button onClick={openCloseModalDelete}>No</Button>,
                    <Button type="primary" danger onClick={requestDelete}>Sí</Button>,
                ]}
            >
                Are you sure that you want to delete this exam <b>{Usuario && Usuario.title}</b>?
            </Modal>
        </div>
    );
}

export default Admin;