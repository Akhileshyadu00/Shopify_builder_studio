import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/",
    },
    callbacks: {
        authorized: ({ token, req }) => {
            const isRootAdmin = req.nextUrl.pathname === "/admin";
            const isNestedAdmin = req.nextUrl.pathname.startsWith("/admin/");

            // Allow unauthenticated users to visit the root portal to log in or register
            if (isRootAdmin) {
                return true;
            }

            // Strictly protect nested admin routes
            if (isNestedAdmin && token?.role !== "admin") {
                return false;
            }

            return !!token;
        },
    },
});

export const config = {
    matcher: ["/upload", "/profile", "/admin/:path*"],
};
