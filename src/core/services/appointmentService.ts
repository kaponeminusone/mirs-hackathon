import { Appointment } from "@/components/dashboard/sidebar/AppointmentsCalendar";

interface BackendAppointment {
    id: number;
    patient: {
        id: string;
        firstName: string;
        lastName: string;
        fullName: string;
    };
    doctor: {
        id: number;
        name: string;
        specialty: {
            name: string;
        };
    };
    dateTime: string;
    reason: string;
}

const API_BASE_URL = '/api/backend';

export const appointmentService = {
    getAppointmentsByPatientId: async (patientId: string): Promise<Appointment[]> => {
        try {
            // Add a small timeout (optional) or just fetch
            const response = await fetch(`${API_BASE_URL}/appointments/patient/${patientId}`);

            if (!response.ok) {
                // Throwing allows the component to catch and set isError=true
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data: BackendAppointment[] = await response.json();
            return apiToUiModel(data);

        } catch (error) {
            console.error("Error fetching appointments:", error);
            throw error; // Propagate error to UI
        }
    }
};

function apiToUiModel(data: any[]): Appointment[] {
    return data.map(apt => {
        const dateObj = new Date(apt.dateTime);
        const timeStr = dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const dateStr = dateObj.toLocaleDateString('en-CA');

        return {
            id: apt.id.toString(),
            title: `Consulta de ${apt.doctor.specialty.name}`,
            doctor: apt.doctor.name,
            time: timeStr,
            location: "Consultorio Virtual MIRS",
            date: dateStr,
            type: 'checkup',
        };
    });
}
