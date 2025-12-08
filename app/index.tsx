import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

export default function Index() {
    const { user } = useAuthStore();

    // Redirect based on auth state
    if (user) return <Redirect href="/(tabs)/home" />;
    return <Redirect href="/(auth)/sign-in" />;
}
