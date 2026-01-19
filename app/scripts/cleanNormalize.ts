export function normalizeRecord(record: any) {
    // Extract ABN - it's in the ABN tag, and status is an attribute
    const abnElement = record.ABN;
    let abn: string | undefined;
    let status: string | undefined;
    let statusDate: string | undefined;
    
    if (typeof abnElement === 'string') {
      abn = abnElement;
    } else if (abnElement && typeof abnElement === 'object') {
      // ABN text content (after parser cleanup)
      abn = abnElement._text || abnElement._value || String(abnElement);
      // Attributes should be directly on the object
      status = abnElement.status;
      statusDate = abnElement.ABNStatusFromDate;
    }
    
    // Extract business name - could be in MainEntity or LegalEntity
    let businessName: string | undefined;
    if (record.MainEntity?.NonIndividualName?.NonIndividualNameText) {
      businessName = record.MainEntity.NonIndividualName.NonIndividualNameText;
    } else if (record.LegalEntity?.IndividualName) {
      // For individuals, construct name from given and family names
      const individual = record.LegalEntity.IndividualName;
      const givenNames = Array.isArray(individual.GivenName) 
        ? individual.GivenName.join(' ')
        : individual.GivenName || '';
      const familyName = individual.FamilyName || '';
      businessName = `${givenNames} ${familyName}`.trim();
    } else if (record.OtherEntity) {
      // Sometimes business name is in OtherEntity
      const otherEntities = Array.isArray(record.OtherEntity) ? record.OtherEntity : [record.OtherEntity];
      const tradingName = otherEntities.find((e: any) => e.NonIndividualName?.type === 'TRD');
      if (tradingName?.NonIndividualName?.NonIndividualNameText) {
        businessName = tradingName.NonIndividualName.NonIndividualNameText;
      }
    }
    
    // Extract address - could be in MainEntity.BusinessAddress or MainBusinessPhysicalAddress
    let state: string | undefined;
    let postcode: string | undefined;
    
    if (record.MainEntity?.BusinessAddress?.AddressDetails) {
      state = record.MainEntity.BusinessAddress.AddressDetails.State;
      postcode = record.MainEntity.BusinessAddress.AddressDetails.Postcode;
    } else if (record.MainBusinessPhysicalAddress) {
      state = record.MainBusinessPhysicalAddress.StateCode || record.MainBusinessPhysicalAddress.State;
      postcode = record.MainBusinessPhysicalAddress.Postcode;
    } else if (record.LegalEntity?.BusinessAddress?.AddressDetails) {
      state = record.LegalEntity.BusinessAddress.AddressDetails.State;
      postcode = record.LegalEntity.BusinessAddress.AddressDetails.Postcode;
    }
    
    return {
      abn: abn,
      status: status,
      statusDate: statusDate,
      entityType: record.EntityType?.EntityTypeText,
      businessName: businessName,
      state: state,
      postcode: postcode
    };
  }