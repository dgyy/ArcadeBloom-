
export function XRSuppQry() {

    console.log('navigator; ', navigator.xr)

    if (navigator.xr) {

        // const immersiveVROK = 
        navigator.xr.isSessionSupported('immersive-vr').then((isSupported) => {

            if (isSupported) {

                addVROKButton();

             }

            if (!isSupported) {

                addNoVRButton()

            }

        });

    }
}

    export async function startSession(type) {

        try {

            const xrSession = await navigator.xr.requestSession(type,
                {
                    //optionalFeatures: ['hand-tracking',]
                });

            onSessionStarted(xrSession);


        } catch (error) {

            alert("Failed to start Web XR session.", error);

            console.log('error', error)


        }
    }

    async function onSessionStarted(session) {

        renderer.xr.setReferenceSpaceType('local');

          await renderer.xr.setSession(session)

    }


    function addVROKButton() {


        const vrOK = createText('Enter VR', 3, 'Courier New', false);
        vrOK.position.set(targetOb.position.x, targetOb.position.y + 10, targetOb.position.z,);
        vrOK.name = "enterVR";
        scene.add(vrOK);
        clickable_2D.push(vrOK);

    }

    function addNoVRButton() {

        const vrNo = createText('VR Not Found :(', 2.5, 'Courier New', false);
        vrNo.position.set(targetOb.position.x, targetOb.position.y + 11, targetOb.position.z,);
        scene.add(vrNo);


    }


