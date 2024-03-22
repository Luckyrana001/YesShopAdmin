import LoginComponent from "../../components/LoginComponent";

const Login = () => {
    return (
      <div
        style={{
          position: "relative",
          backgroundColor: "#fff",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          letterSpacing: "normal",
          textAlign: "right",
          fontSize: "16px",
          color: "#fff",
          fontFamily: "Montserrat",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            padding: "0px 0px 0px 0px",
            boxSizing: "border-box",
            position: "relative",
            maxWidth: "100%",
          }}
        >
          <main
            style={{
              alignSelf: "stretch",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              padding: "193px 547.7px",
              boxSizing: "border-box",
              position: "relative",
              flexShrink: "0",
              debugCommit: "2554057",
            }}
          >
            <img
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                margin: "0",
                top: "0px",
                bottom: "0px",
                left: "0px",
                objectFit: "fill",
              }}
              alt=""
              src="/login_background.png"
            />
            <section
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                margin: "0",
                top: "0px",
                right: "0px",
                bottom: "0px",
                left: "0px",
                background: "linear-gradient(-64.14deg, #ff0084, #2f3bf5 99.03%)",
                mixBlendMode: "overlay",
                zIndex: "1",
              }}
            />
            <section
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                margin: "0",
                top: "982px",
                right: "-1574px",
                bottom: "-982px",
                left: "1574px",
                background: "linear-gradient(-6.79deg, #ff0084, #2f3bf5 99.03%)",
                transform: " rotate(180deg)",
                transformOrigin: "0 0",
                mixBlendMode: "overlay",
                zIndex: "2",
              }}
            />
            <LoginComponent />
          </main>
          <div
            style={{
              width: "271px",
              position: "absolute",
              margin: "0",
              right: "100px",
              bottom: "100px",
              fontWeight: "500",
              display: "inline-block",
              flexShrink: "0",
              zIndex: "4",
            }}
          >
            2024 © YTLC. All Rights Reserved.
          </div>
          <img
            style={{
              height: "120px",
              width: "116.7px",
              position: "absolute",
              margin: "0",
              top: "calc(50% - 60px)",
              left: "100.5px",
              zIndex: "4",
            }}
            loading="lazy"
            alt=""
            src="/logo.svg"
          />
          <img
            style={{
              height: "45.2px",
              width: "116.8px",
              position: "absolute",
              margin: "0",
              top: "calc(50% - 22.6px)",
              left: "242.3px",
              zIndex: "4",
            }}
            loading="lazy"
            alt=""
            src="/shop_icon.svg"
          />
          <div
            style={{
              position: "absolute",
              margin: "0",
              top: "calc(50% - 11px)",
              left: "374.1px",
              fontSize: "18px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: "600",
              textAlign: "left",
              display: "inline-block",
              minWidth: "81px",
              flexShrink: "0",
              zIndex: "4",
            }}
          >
            Admin
          </div>
        </div>
      </div>
    );
  };
  
  export default Login;
  