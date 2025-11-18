import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthService} from "../../../services/auth/AuthService.ts";

export const ChangePasswordPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);

    const [password, setPassword] = useState("");
    const [repeat, setRepeat] = useState("");

    const token = new URLSearchParams(window.location.search).get("token");

    useEffect(() => {
        if (!token) {
            navigate("/auth/login");
            return;
        }

        AuthService.instance.validateRecoveryToken(token)
            .then(() => {
                setValid(true);
            },() => {
                navigate("/auth/login");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (password !== repeat) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const tokenStr = token ?? "";

        AuthService.instance.changePassword({
            token: tokenStr,
            password: password,
            repeated: repeat
        })
            .then(() => {
                    alert("Contraseña cambiada correctamente");
                    navigate("/auth/login");
                },
                () => {
                    alert("Error cambiando la contraseña");
                }
            );
    };



    if (loading) return <p>Validando...</p>;
    if (!valid) return null;

    return (
        <div style={{maxWidth: 400, margin: "50px auto"}}>
            <h2>Cambiar contraseña</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nueva contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div style={{marginTop: 10}}>
                    <label>Repetir contraseña</label>
                    <input
                        type="password"
                        value={repeat}
                        onChange={e => setRepeat(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" style={{marginTop: 20}}>
                    Guardar
                </button>
            </form>
        </div>
    );
};
