import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Form } from "antd";
import "antd/dist/antd.css";
import "./Users.css";
import axios from "axios";
import jsPDF from "jspdf";
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

function Users() {
    const navigate = useNavigate();
    const navigateToHome = () => {
        navigate('/');
    }
    const [data, setData] = useState([]);
    const [modalEdit, setModalEdit] = useState(false);
    const [Usuario, setUsuario] = useState({
        id:'',
        title: '',
        username: '',
        notes: '',
        created_at: '',
    })

    const openCloseModalEdit = () => {
        setModalEdit(!modalEdit);
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

    const selectUser = (user, caso) => {
        setUsuario(user);
        if (caso === "Edit") openCloseModalEdit()
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
                    <Button type="primary" onClick={() => selectUser(fila, "Edit")}>PDF</Button> {"   "}
                </>
            ),
        },
    ];
// Request methods for user
    const requestDownloadPDF = async () => {
        await axios.get(baseUrl + Usuario.id+'/', Usuario)
            .then(response => {
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

    const requestGet = async () => {
        await axios.get(baseUrl)
            .then(response => {
                setData(response.data);
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

    //To call the Get request method
    useEffect(() => {
        requestGet();
    }, [])

    return (
        <div className="App">
            <br />
            <button type="primary" style={{ color: "black", backgroundColor: "#6495ED" }}
                    onClick={navigateToHome}><strong> CLICK TO GO BACK</strong></button>
            <br/>
            <br/>
            <Table columns={columns} dataSource={data} />

            <Modal
                visible={modalEdit}
                title="Editar Usuario"
                onCancel={openCloseModalEdit}
                centered
                footer={[
                    <Button onClick={openCloseModalEdit}>Cancel</Button>,
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

        </div>
    );
}

export default Users;