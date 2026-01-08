import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/",
    },
    callbacks: {
        authorized: ({ token, req }) => {
            if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "admin") {
                return false;
            }
            return !!token;
        },
    },
});

export const config = {
    matcher: ["/upload", "/profile", "/admin/:path*"],
};
