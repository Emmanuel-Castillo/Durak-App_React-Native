import {Appearance, TouchableOpacity, View} from "react-native";
import getColorScheme = Appearance.getColorScheme;
import {FontAwesome} from "@expo/vector-icons";
import setColorScheme = Appearance.setColorScheme;
import {useState} from "react";

type ThemeSetterProps = {
    setterClassName?: string;
    size?: number;
}
const ThemeSetter = ({setterClassName, size}: ThemeSetterProps) => {
    const [theme, setTheme] = useState(getColorScheme())
    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setColorScheme(newTheme)
        setTheme(newTheme)
    }

    return <TouchableOpacity className={setterClassName} onPress={toggleTheme}>
        {theme === "dark" ?
            <FontAwesome name="moon-o" size={size || 24} color="white"/> :
            <FontAwesome name="sun-o" size={size || 24} color="black"/>
        }
    </TouchableOpacity>
}

export default ThemeSetter