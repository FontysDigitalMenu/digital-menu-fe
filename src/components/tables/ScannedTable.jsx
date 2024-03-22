import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";

function ScannedTable() {
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("tableId", id);
        return navigate('/');
    }, []);
}

export default ScannedTable;
