import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/",
    },
    callbacks: {
        authorized: ({ token, req }) => {
            const path = req.nextUrl.pathname;
            const isRootAdmin = path === "/admin";
            const isNestedAdmin = path.startsWith("/admin/");
            const isApiAdmin = path.startsWith("/api/admin");

            // Allow unauthenticated users to visit the root portal to log in
            if (isRootAdmin) return true;

            // Strictly protect nested admin and API admin routes
            if ((isNestedAdmin || isApiAdmin) && token?.role !== "admin") {
                return false;
            }

            // Protect other matching routes (profile, upload)
            return !!token;
        },
    },
});

export const config = {
    matcher: ["/upload", "/profile", "/admin/:path*"],
};
