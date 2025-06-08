import Checkbox from "@/Components/Checkbox";
import InlineInput from "@/Components/InlineInput";
import PrimaryButton from "@/Components/PrimaryButton";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function CopyrightForm({bookId}) {
    const { data, setData, post, errors, setError, clearErrors, processing, recentlySuccessful } =
        useForm({
            nameOfRequester: "",
            nameOfOwner: "",
            workTitle: "",
            workDescription: "",
            infringingMaterial: "",
            infringingDescription: "",
            locationUrl: route('viewer', bookId),
            infringedWork: "",
            goodFaith: false,
            email: "",
            phone: "",
            post: "",
            preference: "",
            informationAccuracy: false,
            fullName: "",
            eSignature: "",
        });
    
    function submit(e) {
        e.preventDefault();

        clearErrors();

        if (!data.goodFaith || !data.informationAccuracy) {
            if (!data.goodFaith) {
                setError("goodFaith", "This must be checked.");
            }
            if (!data.informationAccuracy) {
                setError("informationAccuracy", "This must be checked.");
            }
            
            return;
        }
        
        post(route('report.newcopyright', {"book": bookId}));
    }

    return (
        <AuthenticatedLayout title={"Removal form"}>
            <div className="mx-4 sm:mx-6 lg:mx-8 py-12 px-6">
                <h1 className="text-3xl">Notice of Copyright Infringement</h1>
                <h2 className="text-xl">Request for Removal of Infringing Material</h2>
  
                <form class="mt-5 space-y-8" onSubmit={submit}>
                    <div className="space-y-1">
                    <p class="flex items-center flex-wrap gap-1">
                        <span>I,</span>
                        <InlineInput 
                            value={data.nameOfRequester}
                            onChange={(e) => setData('nameOfRequester', e.target.value)}
                            required
                            className="w-96" 
                            type="text" 
                            placeholder="Name of requester"
                        />
                        <span>certify that</span>
                        <InlineInput 
                            value={data.nameOfOwner}
                            onChange={(e) => setData('nameOfOwner', e.target.value)}
                            required
                            className="w-96" 
                            type="text" 
                            placeholder="I am / Name of Copyright Owner is"
                        />
                    </p>

                        <p>
                            <span>the owner of the following work(s):</span>
                            <TextArea 
                                value={data.workTitle}
                                onChange={(e) => setData('workTitle', e.target.value)}
                                required
                                className="w-full mt-2" 
                                placeholder="Title of Work(s) being Infringed"
                            />
                        </p>
                        
                        <p>
                            <span>a</span>
                            <TextArea 
                                value={data.workDescription}
                                onChange={(e) => setData('workDescription', e.target.value)}
                                required
                                className="w-full mt-2" 
                                placeholder="Description of Work(s) (If the notice covers multiple works, a representative list of works being infringed)"
                            />
                        </p>
                    </div>
                    
                    <div>
                        <p className="flex items-center flex-wrap gap-1 space-y-1">
                            <span>The material</span>
                            <InlineInput value={data.infringingMaterial} onChange={(e) => setData('infringingMaterial', e.target.value)} required className="w-96" type="text" placeholder="Name of Infringing Material(s)"/>
                            <span>, a</span>
                            <InlineInput value={data.infringingDescription} onChange={(e) => setData('infringingDescription', e.target.value)} required className="w-96" type="text" placeholder="Description of Infringing Material(s)"/>
                            <span>located at</span>
                            <InlineInput value={data.locationUrl} onChange={(e) => setData('locationUrl', e.target.value)} required className="w-96" type="text" placeholder="Location/URL"/>
                            <span>infringes</span>
                            <InlineInput  value={data.infringedWork} onChange={(e) => setData('infringedWork', e.target.value)} required className="w-96" type="text" placeholder="Title of Work"/>
                            <span>listed above.</span>
                        </p>
                    </div>

                    

                    <div className="space-y-5">
                        <Checkbox checked={data.goodFaith} onChange={(e) => setData('goodFaith', e.target.value)} required className="w-full" label="I have a good faith belief that the use of the work(s) described above in the material(s) listed here is not authorized by the
copyright owner, an agent of the copyright owner, or the law." id="goodfaith"></Checkbox>
                        <Checkbox checked className="w-full" disabled label="I request that you expeditiously remove or disable access to the material identified directly above." id="deleterequest"></Checkbox>
                    </div>

                    <div>
                        <p className="flex items-center flex-wrap gap-1 space-y-1">
                            <span>You may contact me at</span>
                            <InlineInput value={data.email} onChange={(e) => setData('email', e.target.value)} required className="w-96" type="email" placeholder="Email"></InlineInput>
                            <span>,</span>
                            <InlineInput value={data.phone} onChange={(e) => setData('phone', e.target.value)} required className="w-96" type="number" placeholder="Phone"></InlineInput>
                            <span>,</span>
                            <InlineInput value={data.post} onChange={(e) => setData('post', e.target.value)} required type="text" className="w-full" placeholder="Post Adress"></InlineInput>
                            <span>; prefereably by</span>
                            <InlineInput value={data.preference} onChange={(e) => setData('preference', e.target.value)} required className="w-96" type="text" placeholder="Contact Preference"></InlineInput>
                            <span>.</span>
                        </p>
                    </div>

                    <div className="space-y-5">
                        <Checkbox checked={data.informationAccuracy} onChange={(e) => setData('informationAccuracy', e.target.value)} required className="w-full" label="Under penalty of perjury, I attest that the information in this notification is accurate and that I am, or am authorized to
act on behalf of, the owner of the rights being infringed by the material listed above." id="accuracy"></Checkbox>
                    </div>

                    <div>
                        <p className="flex items-center flex-wrap gap-1 space-y-1">
                            <TextInput value={data.fullName} onChange={(e) => setData('fullName', e.target.value)} required id="fullname" className="w-full" type="text"></TextInput>
                            <label htmlFor="fullname">Full Name</label>
                            <TextInput value={data.eSignature} onChange={(e) => setData('eSignature', e.target.value)} required id="esignature" className="w-full" type="text"></TextInput>
                            <label htmlFor="esignature">Electronic Signature</label>
                        </p>
                    </div>

                    <div className="space-x-3 flex flex-wrap items-center">
                        <PrimaryButton className="btn-medium mr-5" disabled={processing}>Submit</PrimaryButton>
                        {Object.keys(errors).map((field) => (<p className="text-red-700">{field}: {errors[field]}</p>))}
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}