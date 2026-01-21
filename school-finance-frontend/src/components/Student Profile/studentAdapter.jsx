export function adaptStudentFromApi(apiStudent) {

    
  return {
    id: apiStudent.id,

    personal: {
      index_number: apiStudent.result.student_code,
      full_name: apiStudent.result.full_name,
      default_fees: Number(apiStudent.result.default_fees),
    },

    contact: {
      phone: apiStudent.result.phone || "",
      index_number: apiStudent.result.student_code
    },

    meta: {
      class_id: Number(apiStudent.result.class_id),
      sequence: Number(apiStudent.result.sequence),
    },
  };
}
